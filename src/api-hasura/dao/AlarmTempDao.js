import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { override, readonly } from 'core-decorators'
import { createTime, updateTime } from '../utils/mixin/autoComplete'

class AlarmTempDao extends BaseDao {
  @readonly
  static SCHEMA = 't_alarm_temp'

  @readonly
  static PROVIDER = alert

  @readonly
  static PRIMARY_KEY = 'id'

  @readonly
  static UNIQUE_FIELDS = ['title']

  @readonly
  static FIELDS_MAPPING = new Map([
    ['title', '模板名称']
  ])

  @override
  static async find ({ orderBy = { create_time: 'desc_nulls_last' }, ...rest }) {
    return super.find({ orderBy, ...rest })
  }

  @override
  static async add (argus) {
    await this._uniqueValidate(argus)
    return super.add({
      ...argus,
      ...createTime()
    })
  }

  @override
  static async update (set, where) {
    await this._uniqueValidate(set, false)
    return super.update({
      ...set,
      ...updateTime()
    }, where)
  }
}

export {
  AlarmTempDao
}
