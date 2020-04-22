import _ from 'lodash'
import { batchQuery } from '../utils/hasura-orm'

class BaseService {
  /**
   * Dao 唯一字段校验
   * @param {Object} obj 校验对象实体
   * @param {Dao} Dao 校验Dao
   * @param {Boolean} add 新增模式下校验
   */
  static async uniqueValidate (obj = {}, Dao, add = true) {
    const { PRIMARY_KEY } = Dao

    const queryList = _.flow(
      // 挑选出要校验的值
      () => _.pick(obj, Dao.UNIQUE_FIELDS),
      // 过滤空值
      val => _.pickBy(val, v => !_.isEmpty(v)),
      // 对象转二维数组
      val => _.entries(val),
      // 拼接查询条件
      val => val.map(([key, value]) => Dao.find({ where: { [key]: { _eq: value } } }).alias(key).select(_.uniq([key, PRIMARY_KEY])))
    )()

    const { data } = await batchQuery(...queryList)

    const errList = _.flow(
      // 对象转二维数组
      () => _.entries(data),
      // 挑选出已存在的数据
      val => val.filter(([key, value]) => !_.isEmpty(value)),
      // 如果处于编辑模式下，检查冲突的内容是否为自身
      val => val.filter(([key, value]) => add || value.every(el => el[PRIMARY_KEY] !== obj[PRIMARY_KEY])),
      // 输出报错信息
      val => val.map(([key]) => `已存在的${Dao.FIELDS_MAPPING.get(key) || key}：${obj[key]}`)
    )()

    return _.isEmpty(errList) ? Promise.resolve() : Promise.reject(errList.join('<br />'))
  }
}

export {
  BaseService
}
