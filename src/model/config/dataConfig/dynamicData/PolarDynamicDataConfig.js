/**
* 极坐标数据配置
* Date: 2020/5/20
* Time: 1:40 下午
*/

import _ from 'lodash'
import { DynamicDataConfig } from './common/index'

const initialOption = {
  legend: {},
  series: [],
  angleAxis: { data: [] }
}

export default class PolarDynamicDataConfig extends DynamicDataConfig {
  async fetch () {
    const dataList = await super.fetch()
    const groupByLegend = _.groupBy(dataList, 'legend')
    const legendList = Object.keys(groupByLegend)
    const groupByName = _.groupBy(dataList, 'name')
    const categoryList = Object.keys(groupByName)
    const option = {
      legend: {
        data: categoryList
      },
      angleAxis: {
        type: 'category',
        data: legendList
      },
      series: categoryList.map(name => ({
        name: name,
        data: groupByName[name].map(({ data }) => data)
      }))

    }
    return option
  }

  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      const {
        angleAxis,
        legend,
        series
      } = await this.fetch()
      Object.assign(this, { angleAxis, legend, series })
    }
    const { angleAxis, legend, series } = this
    return { angleAxis, legend, series }
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
