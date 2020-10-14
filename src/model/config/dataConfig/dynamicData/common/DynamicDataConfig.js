/**
 * 动态数据配置
 */

import { AdaptorResourceConfig } from './AdaptorResourceConfig'
import { AdaptorAlarmConfig } from './AdaptorAlarmConfig'
import { AdaptorOverviewConfig } from './AdaptorOverviewConfig'

export class DynamicDataConfig {
  constructor ({
    // 外部CI可用
    externalCi = true,
    // 性能数据配置
    resourceConfig = {},
    // 告警数据配置
    alarmConfig = {},
    // 总览数据配置
    overviewConfig = {}
  }) {
    this.externalCi = externalCi
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.alarmConfig = new AdaptorAlarmConfig(alarmConfig)
    this.overviewConfig = new AdaptorOverviewConfig(overviewConfig)
    this.resetData()
  }

  getOption () {
    return {
      ...this,
      resourceConfig: this.resourceConfig.getOption(),
      alarmConfig: this.alarmConfig.getOption(),
      overviewConfig: this.overviewConfig.getOption()
    }
  }

  resetData () {}
}
