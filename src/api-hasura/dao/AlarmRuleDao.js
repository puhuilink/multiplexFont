import { query } from '../utils/hasura-orm/index'
import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { override, readonly } from 'core-decorators'
import { createTime, updateTime } from '../utils/mixin/autoComplete'
import _ from 'lodash'

class AlarmRuleDao extends BaseDao {
  @readonly
  static SCHEMA = 't_alarm_rule'

  @readonly
  static PROVIDER = alert

  @readonly
  static PRIMARY_KEY = 'id'

  @readonly
  static FIELDS_MAPPING = new Map([])

  @override
  static async _uniqueValidate ({ id, rule_type, host_id, endpoint_id, metric_id } = {}, add = true) {
    const { data: { alarmRuleList } } = await query(
      AlarmRuleDao.find({
        where: { rule_type, host_id, endpoint_id, metric_id, mode: 'personal' },
        fields: ['id', 'title'],
        alias: 'alarmRuleList'
      })
    )

    const errList = alarmRuleList
      .filter(alarmRule => add || id !== alarmRule.id)
      .map(alarmRule => `已存在当前配置的规则搭配：${alarmRule.title}`)

    return _.isEmpty(errList) ? Promise.resolve() : Promise.reject(errList.join('<br />'))
  }

  @override
  static async add (argus) {
    await this._uniqueValidate(argus)
    return super.add({
      ...argus,
      mode: 'personal',
      ...createTime()
    })
  }

  @override
  static async update (set, where) {
    await this._uniqueValidate(set, false)
    return super.update({
      ...set,
      mode: 'personal',
      ...updateTime()
    }, where)
  }
}

export {
  AlarmRuleDao
}
