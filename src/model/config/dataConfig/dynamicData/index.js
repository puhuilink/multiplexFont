/**
 * 动态数据配置公共模块
 */

import _ from 'lodash'
import moment from 'moment'
import { KpiCurrentService } from '@/api-hasura'

// https://itbilu.com/nodejs/npm/EJlmbFhgg.html
const defaultTimeStart = {
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
}
const defaultTimeEnd = _.cloneDeep(defaultTimeStart)
export const timeRangeSelectOptions = [
  {
    name: '实时',
    value: Object.assign(defaultTimeStart, {})
  },
  {
    name: '最近15分钟',
    value: Object.assign({}, defaultTimeStart, { minutes: '-15' })
  },
  {
    name: '最近30分钟',
    value: Object.assign({}, defaultTimeStart, { minutes: '-30' })
  },
  {
    name: '最近1小时',
    value: Object.assign({}, defaultTimeStart, { hours: '-1' })
  },
  {
    name: '最近1天',
    value: Object.assign({}, defaultTimeStart, { days: '-1' })
  },
  {
    name: '最近1周',
    value: Object.assign({}, defaultTimeStart, { weeks: '-1' })
  },
  {
    name: '最近2周',
    value: Object.assign({}, defaultTimeStart, { weeks: '-2' })
  },
  {
    name: '最近1月',
    value: Object.assign({}, defaultTimeStart, { months: '-1' })
  },
  {
    name: '最近2月',
    value: Object.assign({}, defaultTimeStart, { months: '-2' })
  }
]

export class TimeRange {
  static FORMAT = 'YYYY-MM-DDTHH:mm:ss'

  constructor (
    timeRangeStart = _.cloneDeep(defaultTimeStart),
    timeRangeEnd = _.cloneDeep(defaultTimeEnd)
  ) {
    this.timeRangeStart = timeRangeStart
    this.timeRangeEnd = timeRangeEnd
  }

  /**
   * 获取时间段
   * @return {{ timeRangeStart: String, timeRangeEnd: String }} // 时间段
   */
  static getOption () {
    return {
      timeRangeStart: moment().add(this.timeRangeStart).format(TimeRange.FORMAT),
      timeRangeEnd: moment().add(this.timeRangeEnd).format(TimeRange.FORMAT)
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
    timeRange = new TimeRange()
  }) {
    this.resourceConfig = resourceConfig
    this.externalCi = externalCi
    this.refreshTime = refreshTime
    this.timeRange = timeRange
    this.xAxisType = xAxisType
    this.resetData()
  }

  fetch (argus = {}) {
    const { resourceConfig, timeRange } = this
    return KpiCurrentService.getValue({
      ...resourceConfig,
      timeRange: TimeRange.getOption.apply(timeRange),
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
