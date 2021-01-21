/**
 * 动态数据配置
 */

import { AdaptorResourceConfig } from './AdaptorResourceConfig'
import { AdaptorAlarmConfig } from './AdaptorAlarmConfig'
import { AdaptorOverviewConfig } from './AdaptorOverviewConfig'
import { AdaptorComboConfig } from './AdaptorComboConfig'

export class DynamicDataConfig {
  constructor ({
    // 性能数据配置
    resourceConfig = {},
    // 告警数据配置
    alarmConfig = {},
    // 总览数据配置
    overviewConfig = {},
    // 新接口统一数据配置
    comboConfig = {}
  }) {
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.alarmConfig = new AdaptorAlarmConfig(alarmConfig)
    this.overviewConfig = new AdaptorOverviewConfig(overviewConfig)
    this.comboConfig = new AdaptorComboConfig(comboConfig)
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
