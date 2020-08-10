/**
 * 动态数据配置公共模块
 */

import { TimeRangeConfig } from './TimeRangeConfig'
import { AdaptorDataConfig } from './AdaptorDataConfig'
import _ from 'lodash'

export class DynamicDataConfig {
  constructor ({
    resourceConfig = {
      // model: '',
      // selectedInstance: [],
      // selectedKpi: [],
      // detailInstance: [],
      // new cmdb
      cmdbHostIdList: [],
      modelEndpointId: null,
      modelMetricIdList: [],
      modelHostId: null
    },
    // 横轴类型
    xAxisType = 'RESOURCE',
    refreshTime = 0,
    // 外部 Ci 是否可用
    externalCi = true,
    timeRangeConfig = {}
  }) {
    // this.resourceConfig = resourceConfig
    this.resourceConfig = {
      cmdbHostIdList: [257882722304],
      modelEndpointId: 1988235274,
      modelMetricIdList: [1988235275],
      modelHostId: 1988235264
    }
    this.externalCi = externalCi
    this.refreshTime = refreshTime
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.xAxisType = xAxisType
    this.resetData()
  }

  fetch (argus = {}) {
    const { resourceConfig, timeRangeConfig } = this
    return AdaptorDataConfig.fetch({
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
