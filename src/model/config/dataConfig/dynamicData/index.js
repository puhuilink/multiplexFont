/**
 * 动态数据配置公共模块
 */

import _ from 'lodash'
import moment from 'moment'
import { KpiCurrentService } from '@/api-hasura'

export const TIME_RANGE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
export const TIME_RANGE_TYPE_DEFAULT = 'default'
export const TIME_RANGE_TYPE_RECENT = 'recent'
export const TIME_RANGE_TYPE_CUSTOM = 'custom'
export const TIME_TYPE_SECONDS = 'seconds'
export const TIME_TYPE_MINUTES = 'minutes'
export const TIME_TYPE_HOURS = 'hours'
export const TIME_TYPE_DAYS = 'days'
export const TIME_TYPE_WEEKS = 'weeks'
export const TIME_TYPE_MONTHS = 'months'
export const TIME_TYPE_YEARS = 'years'

// https://itbilu.com/nodejs/npm/EJlmbFhgg.html
export const DEFAULT_TIME_RANGE_START = {
  [TIME_TYPE_YEARS]: 0,
  [TIME_TYPE_MONTHS]: 0,
  [TIME_TYPE_WEEKS]: 0,
  [TIME_TYPE_DAYS]: 0,
  [TIME_TYPE_HOURS]: 0,
  [TIME_TYPE_MINUTES]: 0,
  [TIME_TYPE_SECONDS]: 0
}
export const DEFAULT_TIME_RANGE_END = _.cloneDeep(DEFAULT_TIME_RANGE_START)

export class TimeRangeConfig {
  constructor ({
    timeRangeStart = _.cloneDeep(DEFAULT_TIME_RANGE_START),
    timeRangeEnd = _.cloneDeep(DEFAULT_TIME_RANGE_END),
    timeRangeType = TIME_RANGE_TYPE_DEFAULT,
    recentType = TIME_TYPE_MINUTES,
    recentValue = 0,
    customTimeRange = [
      moment().format(TIME_RANGE_FORMAT),
      moment().format(TIME_RANGE_FORMAT)
    ]
  }
  ) {
    this.timeRangeStart = timeRangeStart
    this.timeRangeEnd = timeRangeEnd
    this.timeRangeType = timeRangeType
    this.recentType = recentType
    this.recentValue = recentValue
    this.customTimeRange = customTimeRange
  }

  getOption () {
    const { timeRangeType } = this
    switch (timeRangeType) {
      case TIME_RANGE_TYPE_DEFAULT: {
        const { timeRangeStart, timeRangeEnd } = this
        // 实时数据
        if (Object.values(timeRangeStart).every(v => v === 0) && Object.values(timeRangeEnd).every(v => v === 0)) {
          return {}
        }
        // 历史数据
        return {
          timeRangeStart: moment().add(timeRangeStart).format(TIME_RANGE_FORMAT),
          timeRangeEnd: moment().add(timeRangeEnd).format(TIME_RANGE_FORMAT)
        }
      }
      case TIME_RANGE_TYPE_RECENT: {
        const { recentType, recentValue } = this
        const timeRangeStart = Object.assign(DEFAULT_TIME_RANGE_START, { [recentType]: recentValue })
        return {
          timeRangeStart: moment().add(timeRangeStart).format(TIME_RANGE_FORMAT),
          timeRangeEnd: moment().format(TIME_RANGE_FORMAT)
        }
      }
      case TIME_RANGE_TYPE_CUSTOM: {
        const { customTimeRange = [] } = this
        const [timeRangeStart, timeRangeEnd] = customTimeRange
        return {
          timeRangeStart,
          timeRangeEnd
        }
      }
    }
  }
}

export class DynamicDataConfig {
  constructor ({
    resourceConfig = {
      model: '',
      selectedInstance: [],
      selectedKpi: [],
      detailInstance: []
    },
    // 横轴类型
    xAxisType = 'RESOURCE',
    refreshTime = 0,
    // 外部 Ci 是否可用
    externalCi = true,
    timeRangeConfig = {}
  }) {
    this.resourceConfig = resourceConfig
    this.externalCi = externalCi
    this.refreshTime = refreshTime
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.xAxisType = xAxisType
    this.resetData()
  }

  fetch (argus = {}) {
    const { resourceConfig, timeRangeConfig } = this
    return KpiCurrentService.getValue({
      ...resourceConfig,
      timeRange: timeRangeConfig.getOption(),
      orderBy: { arising_time: 'desc' },
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

// 饼图、柱形图、线图等可配置图例的图
export class AxisDynamicDataConfig extends DynamicDataConfig {
  constructor ({ legendType = ['ci'], originalData = [], ...props }) {
    super(props)
    this.legendType = legendType
    this.originalData = originalData
  }

  /**
   * 返回经过计算之后的可直接用于 echarts 配置的 data
   */
  getComposedData () {
    const {
      legendType,
      composeDataByKpi,
      composeDataByCi,
      composeDataByInstance,
      composeDataByCiAndKpi,
      composeDataByInstanceAndKpi,
      composeDataByCiAndInstance,
      composeDataByAll
    } = this
    const legendHandlerMapping = new Map()
      .set('ci', composeDataByCi.bind(this))
      .set('kpi', composeDataByKpi.bind(this))
      .set('instance', composeDataByInstance.bind(this))
      .set('ci,kpi', composeDataByCiAndKpi.bind(this))
      .set('ci,instance', composeDataByCiAndInstance.bind(this))
      .set('instance,kpi', composeDataByInstanceAndKpi.bind(this))
      .set('ci,kpi,instance', composeDataByAll.bind(this))

    const handler = legendHandlerMapping.get(_.orderBy(_.isEmpty(legendType) ? ['ci'] : legendType).join(','))
    return handler()
  }

  composeDataByCi () {
    const { groupByCi, groupByKpi, originalData = [] } = this
    const dataGroupByCi = groupByCi(originalData)
    const dataGroupByKpi = groupByKpi(originalData)
    console.log(_.cloneDeep(dataGroupByCi))
    return {
      legend: {
        data: Object.keys(dataGroupByCi)
      },
      xAxis: {
        type: 'category',
        data: Object.keys(dataGroupByKpi)
      },
      yAxis: {
        type: 'value'
      },
      series: Object.keys(dataGroupByKpi).map(key => ({
        type: 'bar',
        name: key,
        data: dataGroupByKpi[key].map(item => _.get(item, 'value', 0))
      }))
    }
  }

  composeDataByKpi () {
    const { groupByCi, groupByKpi, originalData = [] } = this
    console.log(originalData)
    const dataGroupByCi = groupByCi(originalData)
    const dataGroupByKpi = groupByKpi(originalData)
    return {
      legend: {
        data: Object.keys(dataGroupByKpi)
      },
      xAxis: {
        type: 'category',
        data: Object.keys(dataGroupByCi)
      },
      yAxis: {
        type: 'value'
      },
      series: Object.keys(dataGroupByKpi).map(key => ({
        type: 'bar',
        name: key,
        data: _.sum(
          dataGroupByKpi[key].map(item => _.get(item, 'value', 0))
        )
      }))
    }
  }

  // TODO: 组合式搭配后期实现，下同
  // TODO: 区分横轴类型
  composeDataByInstance () {
    const { groupByInstance, groupByKpi, originalData = [] } = this
    const dataGroupByInstance = groupByInstance(originalData)
    const dataGroupByKpi = groupByKpi(originalData)
    console.log(dataGroupByInstance)
    return {
      legend: {
        data: Object.keys(dataGroupByInstance)
      },
      xAxis: {
        type: 'category',
        data: Object.keys(dataGroupByKpi)
      },
      yAxis: {
        type: 'value'
      },
      series: Object.keys(dataGroupByInstance).map(key => ({
        type: 'bar',
        name: key,
        data: dataGroupByInstance[key].map(item => _.get(item, 'value', 0))
      }))
    }
  }

  composeDataByCiAndKpi () {
    console.log('composeDataByCiAndKpi')
  }

  composeDataByCiAndInstance () {
    console.log('composeDataByCiAndInstance')
  }

  composeDataByInstanceAndKpi () {
    console.log('composeDataByInstanceAndKpi')
  }

  composeDataByAll () {
    console.log('composeDataByAll')
  }
}
