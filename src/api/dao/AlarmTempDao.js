import { imp } from '../config/client'
import { BaseDao } from './BaseDao'
import { createTime, updateTime } from '../utils/mixin/autoComplete'

class AlarmTempDao extends BaseDao {
  static SCHEMA = 't_alarm_temp'

  static PROVIDER = imp

  static PRIMARY_KEY = 'id'

  static UNIQUE_FIELDS = ['title']

  static FIELDS_MAPPING = new Map([
    ['title', '模板名称']
  ])

  static async find ({ orderBy = { create_time: 'desc_nulls_last' }, ...rest }) {
    return super.find({ orderBy, ...rest })
  }

  static async add (argus) {
    await this._uniqueValidate(argus)
    return super.add({
      ...argus,
      ...createTime()
    })
  }

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
