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
import { AdaptorOrmConfig } from './AdaptorOrmConfig'
import {
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_DH,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_NUMBER,
  SOURCE_TYPE_SQL,
  SOURCE_TYPE_ORM,
  SOURCE_TYPE_STATIC_TRAFFIC,
  SOURCE_TYPE_CPE,
  SOURCE_TYPE_OPEN,
  SOURCE_TYPE_CPE_STATUS,
  SOURCE_TYPE_PLUS
} from '../types/sourceType'
import { AdaptorOpenConfig } from '@/model/config/dataConfig/dynamicData/common/AdaptorOpenConfig'
import { AdaptorPlusConfig } from '@/model/config/dataConfig/dynamicData/common/AdaptorPlusConfig'
import { AdaptorStaticSiteConfig } from '@/model/config/dataConfig/dynamicData/common/AdaptorStaticSiteConfig'
import AdaptorCpeConfig from '@/model/config/dataConfig/dynamicData/common/AdaptorCpeConfig'
import AdaptorCpeStatusConfig from '@/model/config/dataConfig/dynamicData/common/AdaptorCpeStatusConfig'

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
    sqlConfig = {},
    // 自定义sql数据配置
    openConfig = {},
    // Orm数据配置
    ormConfig = {},
    // 站点流量配置
    siteTrafficConfig = {},
    // 站点CPE数据
    siteCpeConfig = {},
    // 站点CPE状态
    siteCpeStatusConfig = {},
    // 自定义加强版
    plusConfig = {}

  }) {
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.alarmConfig = new AdaptorAlarmConfig(alarmConfig)
    this.overviewConfig = new AdaptorOverviewConfig(overviewConfig)
    this.comboConfig = new AdaptorComboConfig(comboConfig)
    this.dhConfig = new AdaptorDHConfig(dhConfig)
    this.numberConfig = new AdaptorNumConfig(numberConfig)
    this.sqlConfig = new AdaptorSqlConfig(sqlConfig)
    this.ormConfig = new AdaptorOrmConfig(ormConfig)
    this.siteTrafficConfig = new AdaptorStaticSiteConfig(siteTrafficConfig)
    this.siteCpeConfig = new AdaptorCpeConfig(siteCpeConfig)
    this.siteCpeStatusConfig = new AdaptorCpeStatusConfig(siteCpeStatusConfig)
    this.plusConfig = new AdaptorPlusConfig(plusConfig)
    this.openConfig = new AdaptorOpenConfig(openConfig)
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
      sqlConfig: this.sqlConfig.getOption(),
      openConfig: this.openConfig.getOption(),
      ormConfig: this.ormConfig.getOption(),
      siteTrafficConfig: this.siteTrafficConfig.getOption(),
      siteCpeConfig: this.siteCpeConfig.getOption(),
      siteCpeStatusConfig: this.siteCpeStatusConfig.getOption(),
      plusConfig: this.plusConfig.getOption()
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
      case SOURCE_TYPE_ORM: return this.ormConfig
      case SOURCE_TYPE_STATIC_TRAFFIC: return this.siteTrafficConfig
      case SOURCE_TYPE_CPE: return this.siteCpeConfig
      case SOURCE_TYPE_OPEN: return this.openConfig
      case SOURCE_TYPE_CPE_STATUS: return this.siteCpeStatusConfig
      case SOURCE_TYPE_PLUS: return this.plusConfig
      default: throw new Error(`Unknown dbDataConfig sourceType: ${sourceType}`)
    }
  }

  resetData () {}
}
