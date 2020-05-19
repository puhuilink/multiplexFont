/* eslint-disable no-unused-vars */
import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'
import { override, readonly } from 'core-decorators'

class GroupDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_group'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

  // 唯一字段
  @readonly
  static UNIQUE_FIELDS = ['group_id', 'group_name']

  // 主键
  @readonly
  static PRIMARY_KEY = 'group_id'

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['group_id', '工作组编号'],
    ['group_name', '工作组名称']
  ])

  // @override
  static async add (group) {
    await this._uniqueValidate(group)
    return super.add({
      ...group,
      ...defaultCreateDate()
    })
  }

  // @override
  static async update ({ ...group }, { group_id }) {
    await this._uniqueValidate({ ...group, group_id }, false)
    return super.update({ ...group, ...defaultUpdateDate() }, { group_id })
  }
}

export {
  GroupDao
}
