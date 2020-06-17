import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import { AlarmRuleDao } from '../dao'
import _ from 'lodash'

class AlarmRuleService extends BaseService {
  static async find (argus = {}) {
    return query(
      AlarmRuleDao.find(argus)
    )
  }

  static async detail (id) {
    const { data: { alarmList } } = await this.find({
      where: { id },
      // 全量字段
      fields: ['id', 'title', 'rule_type', 'host_id', 'endpoint_id', 'metric_id', 'content', 'enabled'],
      alias: 'alarmList'
    })
    return _.first(alarmList)
  }

  static async batchDelete (idList = []) {
    return mutate(
      AlarmRuleDao.delete({ id: { _in: idList } })
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
