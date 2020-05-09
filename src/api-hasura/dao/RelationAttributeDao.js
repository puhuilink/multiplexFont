import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { readonly } from 'core-decorators'
import { varcharUuid } from '@/utils/util'

class RelationAttributeDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_cmdb_relationAttribute'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['_id', '_id'],
    ['name', 'name']
  ])

  static async add (argus = {}) {
    // TODO: validate
    const data = {
      ...argus,
      _id: varcharUuid()
    }
    return super.add(data)
  }
  static async update (set, where) {
    // TODO: validate
    return super.update(set, where)
  }
}

export {
  RelationAttributeDao
}
