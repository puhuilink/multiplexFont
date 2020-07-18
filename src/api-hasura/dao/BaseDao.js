import HasuraORM, { query } from '../utils/hasura-orm/index'
import { readonly } from 'core-decorators'
import _ from 'lodash'
import { alert } from '../config/client'

class BaseDao {
  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

  static FIELDS_MAPPING = new Map()

  static PRIMARY_KEY = 'id'

  /**
   * 生成一个新的 hasuraORM 实例
   * @return {HasuraORM}
   */
  static _createHasuraORM () {
    // 部分表没有主键，PRIMARY_KEY 为 undefined
    const fields = [ ..._.uniq([...this.FIELDS_MAPPING.keys(), this.PRIMARY_KEY]) ].filter(Boolean)
    return new HasuraORM(this.SCHEMA, this.PROVIDER, '', fields)
  }

  /**
   * Dao 唯一字段校验
   * @param {Object} obj 校验对象实体
   * @param {Boolean} add 新增模式下校验
   * @return {Promise<Boolean>}
   */
  static async _uniqueValidate (obj = {}, add = true) {
    const self = this

    const { PRIMARY_KEY } = self

    const queryList = _.flow([
      // 挑选出要校验的值
      () => _.pick(obj, self.UNIQUE_FIELDS || []),
      // 过滤空值
      val => _.pickBy(val, v => !_.isEmpty(v)),
      // 对象转二维数组
      val => _.entries(val),
      // 拼接查询条件
      val => val.map(([key, value]) => self._createHasuraORM().where({ [key]: value }).alias(key).select(_.uniq([key, PRIMARY_KEY])))
    ])()

    const { data } = await query(...queryList)

    const errList = _.flow([
      // 对象转二维数组
      () => _.entries(data),
      // 挑选出已存在的数据
      val => val.filter(([key, value]) => !_.isEmpty(value)),
      // 如果处于编辑模式下，检查冲突的内容是否为自身
      val => val.filter(([key, value]) => add || value.every(el => el[PRIMARY_KEY] !== obj[PRIMARY_KEY])),
      // 输出报错信息
      val => val.map(([key]) => `已存在的${self.FIELDS_MAPPING.get(key) || key}：${obj[key]}`)
    ])()

    return _.isEmpty(errList) ? Promise.resolve() : Promise.reject(errList.join('<br />'))
  }

  static async _fetchMaxPrimaryKey (primaryKey) {
    primaryKey = primaryKey || this.PRIMARY_KEY
    const hasuraORM = this._createHasuraORM()
    const key = await hasuraORM.max(primaryKey)
    return key
  }

  /**
   * 新增一条数据
   * @param {Object} argus
   * @return {Promise<HasuraORM>}
   */
  static async add (argus) {
    const hasuraORM = this._createHasuraORM()
    return hasuraORM.insert(argus)
  }

  /**
   * 更新一条或多条数据
   * @param {Object} set 更新的内容
   * @param {Object} where 匹配条件
   * @return {Promise<HasuraORM>}
   */
  static async update (set, where) {
    if (_.isEmpty(where)) {
      throw new Error('更新参数不允许传入空对象，这会导致删除所有数据')
    }
    const hasuraORM = this._createHasuraORM()
    return hasuraORM.update(set).where(where)
  }

  /**
   * 查询数据
   * @param {Object} argus
   * @return {Promise<HasuraORM>}
   */
  static async find ({ where = {}, orderBy = {}, fields = [], limit = 0, offset = 0, alias = '' }) {
    const hasuraORM = this._createHasuraORM()
    let chain = hasuraORM.where(where).orderBy(orderBy).select(fields)
    // 当传入有效 limit 或 有效 offset 时进行分页，否则返回所有数据
    if (limit || offset) {
      chain = chain.paginate(limit, offset)
    }
    // 返回变量的别名，不指定则返回 hasura 默认 schema
    if (alias) {
      chain = chain.alias(alias)
    }
    return chain
  }

  // FIXME: findOne 异常
  /**
   * 查询一条数据
   * @param {Object} argus
   * @return {Promise<HasuraORM>}
   */
  static async findOne (argus = {}) {
    await this.find({ ...argus, limit: 1 })
  }

  /**
   * 删除一条或多条数据
   * @param {Object} where 匹配条件
   * @return {Promise<HasuraORM>}
   */
  static async batchDelete (where) {
    if (_.isEmpty(where)) {
      throw new Error('删除参数不允许传入空对象，这会导致删除所有数据')
    }
    const hasuraORM = this._createHasuraORM()
    return hasuraORM.delete(where)
  }
}

export {
  BaseDao
}
