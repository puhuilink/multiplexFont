/**
 * 动态数据配置公共模块
 */

import { TimeRangeConfig } from './TimeRangeConfig'
import { AdaptorResourceConfig } from './AdaptorResourceConfig'
import _ from 'lodash'

export class DynamicDataConfig {
  constructor ({
    // 外部 Ci 是否可用
    externalCi = true,
    // 定时刷新时间(分)
    refreshTime = 1,
    resourceConfig = {},
    // 查询时间范围
    timeRangeConfig = {}
  }) {
    this.externalCi = externalCi
    this.refreshTime = refreshTime
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.resetData()
  }

  fetch (argus = {}) {
    const { resourceConfig, timeRangeConfig } = this
    return AdaptorResourceConfig
      .fetch({
        resourceConfig,
        timeRange: timeRangeConfig.getOption(),
        ...argus
      })
      .then(r => {
        // console.log(r)
        return r
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
