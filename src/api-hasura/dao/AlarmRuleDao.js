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
  static async _uniqueValidate (alarmRule = {}, add = true) {
    const { rule_type, host_id, endpoint_id, metric_id } = alarmRule
    const { data: { alarmRuleList } } = await query(
      AlarmRuleDao.find({
        where: { rule_type, host_id, endpoint_id, metric_id },
        fields: ['id', 'title'],
        alias: 'alarmRuleList'
      })
    )

    const errList = alarmRuleList
      .filter(({ id }) => add || id !== alarmRule.id)
      .map(({ title }) => `已存在当前配置的规则搭配：${title}`)

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
