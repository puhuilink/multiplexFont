import { AdaptorResourceConfig } from '../config/dataConfig/dynamicData/common/AdaptorResourceConfig'
import { AlarmService } from '@/api-hasura'
import _ from 'lodash'

export class AdaptorNodeConfig extends AdaptorResourceConfig {
  /**
   * 获取最新未处理告警等级
   * 告警不存在或等级为 0 时认为无最新未处理告警
   * @returns {Promise<Number>}
   */
  latestAlarmLevel () {
    // return 1
    const [host_id] = this.hostIds
    return AlarmService.find({
      where: {
        host_id,
        // 0 代表未解决
        state: 0
      },
      fields: [
        'alarm_level'
      ],
      // 以最新一条告警为参照
      limit: 1,
      alias: 'alarmList'
    })
      .then(({ data: { alarmList } }) => alarmList)
      .then(alarmList => _.get(alarmList, '[0].alarm_level', 0))
  }
}
