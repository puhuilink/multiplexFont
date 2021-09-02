/**
 * 动态数据配置
 */

import { AdaptorResourceConfig } from './AdaptorResourceConfig'
import { AdaptorAlarmConfig } from './AdaptorAlarmConfig'
import { AdaptorOverviewConfig } from './AdaptorOverviewConfig'
import { AdaptorComboConfig } from './AdaptorComboConfig'
import { AdaptorDHConfig } from './AdaptorDHConfig'
import { AdaptorNumConfig } from './AdaptorNumConfig'
import { AdaptorSqlConfig } from './AdaptorSqlConfig'
import { SOURCE_TYPE_ALARM, SOURCE_TYPE_COMBO, SOURCE_TYPE_DH, SOURCE_TYPE_OVERVIEW, SOURCE_TYPE_REAL, SOURCE_TYPE_NUMBER, SOURCE_TYPE_SQL } from '../types/sourceType'

export class DynamicDataConfig {
  constructor ({
    // 性能数据配置
    resourceConfig = {},
    // 告警数据配置
    alarmConfig = {},
    // 总览数据配置
    overviewConfig = {},
    // 新接口统一数据配置
    comboConfig = {},
    // 动环数据配置
    dhConfig = {},
    // 数量数据配置
    numberConfig = {},
    // 自定义sql数据配置
    sqlConfig = {}
  }) {
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.alarmConfig = new AdaptorAlarmConfig(alarmConfig)
    this.overviewConfig = new AdaptorOverviewConfig(overviewConfig)
    this.comboConfig = new AdaptorComboConfig(comboConfig)
    this.dhConfig = new AdaptorDHConfig(dhConfig)
    this.numberConfig = new AdaptorNumConfig(numberConfig)
    this.sqlConfig = new AdaptorSqlConfig(sqlConfig)
    this.resetData()
  }

  getOption () {
    return {
      ...this,
      resourceConfig: this.resourceConfig.getOption(),
      alarmConfig: this.alarmConfig.getOption(),
      overviewConfig: this.overviewConfig.getOption(),
      comboConfig: this.comboConfig.getOption(),
      numberConfig: this.numberConfig.getOption(),
      sqlConfig: this.sqlConfig.getOption()
    }
  }

  getCurrentConfig (sourceType) {
    switch (sourceType) {
      case SOURCE_TYPE_ALARM: return this.alarmConfig
      case SOURCE_TYPE_COMBO: return this.comboConfig
      case SOURCE_TYPE_REAL: return this.resourceConfig
      case SOURCE_TYPE_DH: return this.dhConfig
      case SOURCE_TYPE_OVERVIEW: return this.overviewConfig
      case SOURCE_TYPE_NUMBER: return this.numberConfig
      case SOURCE_TYPE_SQL: return this.sqlConfig
      default: throw new Error(`Unknown dbDataConfig sourceType: ${sourceType}`)
    }
  }

  resetData () {}
}
