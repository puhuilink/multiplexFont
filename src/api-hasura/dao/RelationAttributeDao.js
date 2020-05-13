import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { readonly } from 'core-decorators'
import { varcharUuid } from '@/utils/util'
import { ModelDao } from './ModelDao'

class RelationAttributeDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_cmdb_relationAttribute'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

  // 唯一字段
  @readonly
  static UNIQUE_FIELDS = ['name']

  // 主键
  @readonly
  static PRIMARY_KEY = '_id'

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['_id', '_id'],
    ['name', '名称'],
    ['label', '显示名称'],
    ['_class', '_class'],
    ['dataType', 'dataType'],
    ['tabGroup', 'tabGroup'],
    ['defaultValue', 'defaultValue'],
    ['source', 'source'],
    ['relationType', 'relationType'],
    ['mappingType', 'mappingType'],
    ['target', 'target'],
    ['extendModelName', 'extendModelName'],
    ['sourceValue', 'sourceValue'],
    ['value', 'value'],
    ['allowInheritance', 'allowInheritance'],
    ['allowNull', 'allowNull'],
    ['searchField', 'searchField'],
    ['uniqueness', 'uniqueness'],
    ['hidden', 'hidden'],
    ['edit', 'edit'],
    ['assetsAttr', 'assetsAttr'],
    ['order', 'order'],
    ['width', 'width']
  ])

  static async add (argus = {}) {
    await this._uniqueValidate(argus)
    const { allowInheritance, source } = argus
    if (allowInheritance) {
      const res = await ModelDao.find({
        where: { name: source },
        fields: ['parentName']
      })
      console.log(res)
    } else {
      Object.assign(argus, { extendModelName: null })
    }
    const data = {
      ...argus,
      _id: varcharUuid()
    }
    return super.add(data)
  }
  static async update (argus, where) {
    const { allowInheritance, source } = argus
    if (allowInheritance) {
      const modelHasuraORM = await ModelDao.find({
        where: { name: source },
        fields: ['parentName'],
        alias: 'modelList'
      })
      const { data: { modelList: [model] } } = await modelHasuraORM.await()
      const { parentName } = model
      Object.assign(argus, { extendModelName: parentName })
    } else {
      Object.assign(argus, { extendModelName: null })
    }
    return super.update(argus, where)
  }
}

export {
  RelationAttributeDao
}
