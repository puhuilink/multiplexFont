import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import { AlarmRuleDao, AlarmSenderDao } from '../dao'
import { AlarmForwardService } from './AlarmForwardService'
import _ from 'lodash'

class AlarmRuleService extends BaseService {
  static async find (argus = {}) {
    return query(
      AlarmRuleDao.find(argus)
    )
  }

  static async add (argus = {}) {
    return mutate(
      AlarmRuleDao.add(argus)
      // TODO: 关联数据
    )
  }

  static async update (set = {}, where = {}) {
    return mutate(
      AlarmRuleDao.update(set, where)
      // TODO: 关联数据
    )
  }

  static async detail (id) {
    // 告警规则信息
    const { data: { alarmList } } = await this.find({
      where: { id },
      fields: ['id', 'title', 'rule_type', 'host_id', 'endpoint_id', 'metric_id', 'content', 'enabled'],
      alias: 'alarmList'
    })
    const detail = _.first(alarmList)

    // 告警规则类型为前转时，查询其关联的前转配置
    if (_.get(detail, 'rule_type') === 'forward') {
      detail.sendList = await this.sendList(detail)
    }
    return detail
  }

  /**
   * 前转规则的通知内容
   */
  static async sendList ({ host_id, endpoint_id, metric_id }) {
    const { data: { sendList } } = await AlarmForwardService.find({
      where: { host_id, endpoint_id, metric_id },
      fields: ['event_level', 'send_type', 'contact', 'temp_id'],
      alias: 'sendList'
    })

    return sendList
  }

  static async isUniqueConfig (alarmRule = {}) {
    return AlarmRuleDao._uniqueValidate(alarmRule, !alarmRule.id)
  }

  static async batchDelete (alarmRuleList = []) {
    return mutate(
      // 规则表删除
      AlarmRuleDao.batchDelete({ id: { _in: alarmRuleList.map(({ id }) => id) } }),
      // 关联的前转配置删除
      AlarmSenderDao.batchDelete({
        _or: [
          ...alarmRuleList
            .filter(({ rule_type }) => rule_type === 'forward')
            .map(({ host_id, endpoint_id, metric_id }) => ({
              host_id: { _eq: host_id },
              endpoint_id: { _eq: endpoint_id },
              metric_id: { _eq: metric_id }
            }))
        ]
      })
    )
  }

  static async batchEnabled (idList = []) {
    return mutate(
      AlarmRuleDao.update({ enabled: true }, { id: { _in: idList } })
    )
  }

  static async batchDisabled (idList = []) {
    return mutate(
      AlarmRuleDao.update({ enabled: false }, { id: { _in: idList } })
    )
  }
}

export {
  AlarmRuleService
}
