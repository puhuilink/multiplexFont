/* eslint-disable no-unused-vars */
import { BaseDao } from './BaseDao'
import { imp } from '../config/client'
import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'

class GroupDao extends BaseDao {
  // 对应 hasura schema
  static SCHEMA = 't_group'

  // 对应 vue-apollo
  static PROVIDER = imp

  // 唯一字段
  static UNIQUE_FIELDS = ['group_id', 'group_name']

  // 主键
  static PRIMARY_KEY = 'group_id'

  // 字段与显示文字
  static FIELDS_MAPPING = new Map([
    ['group_id', '工作组编号'],
    ['group_name', '工作组名称']
  ])

  static async add (group) {
    await this._uniqueValidate(group)
    return super.add({
      ...group,
      ...defaultCreateDate()
    })
  }

  static async update ({ ...group }, { group_id }) {
    await this._uniqueValidate({ ...group, group_id }, false)
    return super.update({ ...group, ...defaultUpdateDate() }, { group_id })
  }

  static async toggleFlag (group_id, flag) {
    return super.update({ flag, ...defaultUpdateDate() }, { group_id })
  }
}

export {
  GroupDao
}
