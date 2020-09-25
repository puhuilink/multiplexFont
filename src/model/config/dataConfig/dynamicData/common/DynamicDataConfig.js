/**
 * 动态数据配置公共模块
 */

import { AdaptorResourceConfig } from './AdaptorResourceConfig'
import { AdaptorAlarmConfig } from './AdaptorAlarmConfig'
import { AdaptorOverviewConfig } from './AdaptorOverviewConfig'

export class DynamicDataConfig {
  constructor ({
    // 外部 Ci 是否可用
    externalCi = true,
    // 定时刷新时间(分)
    refreshTime = 1,
    resourceConfig = {
      timeRangeConfig: {}
    },
    alarmConfig = {
      timeRangeConfig: {}
    },
    overviewConfig = {
      timeRangeConfig: {}
    }
  }) {
    this.externalCi = externalCi
    this.refreshTime = refreshTime
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.alarmConfig = new AdaptorAlarmConfig(alarmConfig)
    this.overviewConfig = new AdaptorOverviewConfig(overviewConfig)
    this.resetData()
  }

  fetch () {
    return this.resourceConfig.fetch()
  }

  getOption () {}

  resetData () {}
}
