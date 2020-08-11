/**
 * 动态数据配置公共模块
 */

import { TimeRangeConfig } from './TimeRangeConfig'
import { AdaptorResourceConfig } from './AdaptorResourceConfig'
import _ from 'lodash'

export class DynamicDataConfig {
  constructor ({
    resourceConfig = {},
    // 横轴类型
    xAxisType = 'RESOURCE',
    refreshTime = 0,
    // 外部 Ci 是否可用
    externalCi = true,
    timeRangeConfig = {}
  }) {
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.externalCi = externalCi
    this.refreshTime = refreshTime
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.xAxisType = xAxisType
    this.resetData()
  }

  fetch (argus = {}) {
    const { resourceConfig, timeRangeConfig } = this
    return AdaptorResourceConfig.fetch({
      resourceConfig,
      timeRange: timeRangeConfig.getOption(),
      ...argus
    })
  }

  getOption () { }

  groupByInstance (data) {
    return _.groupBy(data, 'instance_id')
  }

  groupByCi (data) {
    return _.groupBy(data, 'instanceLabel')
  }

  groupByKpi (data) {
    return _.groupBy(data, 'kpiLabel')
  }

  groupByArisingTime (data) {
    return _.groupBy(data, 'arising_time')
  }

  resetData () {}
}
