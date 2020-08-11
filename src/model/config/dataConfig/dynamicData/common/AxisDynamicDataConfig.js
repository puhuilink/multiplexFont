/**
 * 饼图、柱形图、线图等可配置图例的图
 */

import { DynamicDataConfig } from './DynamicDataConfig'
import _ from 'lodash'

export class AxisDynamicDataConfig extends DynamicDataConfig {
  constructor ({
    // enum: 资源、时间
    legendType = ['ci'],
    originalData = [],
    // 横轴类型
    xAxisType = 'RESOURCE',
    ...props
  }) {
    super(props)
    this.xAxisType = xAxisType
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
