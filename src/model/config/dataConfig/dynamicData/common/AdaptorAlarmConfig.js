/**
 * 告警数据接口适配层
 */

import { AdaptorConfig } from './AdaptorConfig'
import { ViewDataService } from '@/api-hasura'

export class AdaptorAlarmConfig extends AdaptorConfig {
  constructor ({
    // 数据域
    origin = [],
    // 分组方式:  hour / minute / month
    isGroup = '',
    // 监控类型
    deviceType = [],
    // 告警等级
    level = [],
    ...props
  }) {
    super(props)
    this.origin = origin
    this.isGroup = isGroup
    this.deviceType = deviceType
    this.level = level
  }

  fetch () {
    return ViewDataService
      .alarmData(this.getOption(), this.getTimeoutOption())
      .then(({ data = [] }) => data)
      .catch(() => [])
      .then(this.transfer)
  }

  transfer (dataList = []) {
    return dataList
      .map(({
        alias = '', collect = '', origin = '',
        level1 = 0, level2 = 0, level3 = 0, level4 = 0, level5 = 0
      }) => ({
        legend: alias,
        time: collect,
        name: origin,
        level1,
        level2,
        level3,
        level4,
        level5
      }))
  }
}
