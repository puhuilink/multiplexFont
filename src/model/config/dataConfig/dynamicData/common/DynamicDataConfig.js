/**
 * 动态数据配置公共模块
 */

import { TimeRangeConfig } from './TimeRangeConfig'
import { AdaptorResourceConfig } from './AdaptorResourceConfig'
import { MetricService } from '@/api-hasura'
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
    return MetricService
      .chartValue({
        resourceConfig: resourceConfig.getOption(),
        timeRange: timeRangeConfig.getOption()
      })
      .catch(err => {
        console.error(err)
        return []
      })
      .then(AdaptorResourceConfig.transfer)
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
