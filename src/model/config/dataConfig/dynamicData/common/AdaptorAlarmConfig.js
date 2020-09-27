/**
 * 告警数据接口适配层
 */

import { AdaptorConfig } from './AdaptorConfig'
import { ViewDataService } from '@/api-hasura'
import _ from 'lodash'

export class AdaptorAlarmConfig extends AdaptorConfig {
  constructor ({
    // 数据域
    origin = [],
    // 监控类型
    deviceType = [],
    // 告警等级
    level = [],
    // 定时刷新时间(分钟)
    refreshTime = 0,
    ...props
  }) {
    super(props)
    this.origin = origin
    this.deviceType = deviceType
    this.level = level
    this.refreshTime = refreshTime
  }

  fetch () {
    return ViewDataService
      .alarmData(this.getOption())
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

  getOption () {
    return {
      ..._.omit(this, 'timeRangeConfig'),
      timeRange: this.timeRangeConfig.getOption()
    }
  }
}
