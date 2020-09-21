import _ from 'lodash'
import { DynamicDataConfig } from './common/index'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: [],
  originalData: null
}

export default class BarDynamicDataConfig extends DynamicDataConfig {
  async fetch () {
    const dataList = await super.fetch()
    const groupByLegend = _.groupBy(dataList, 'legend')
    const categoryList = Object.keys(groupByLegend)
    const groupByName = _.groupBy(dataList, 'name')
    const legendList = Object.keys(groupByName)
    const option = {
      legend: {
        data: legendList
      },
      xAxis: {
        type: 'category',
        data: categoryList
      },
      yAxis: {
        type: 'value'
      },
      series: legendList.map(name => ({
        name: name,
        data: groupByName[name].map(({ data }) => data)
      }))

    }
    return option
  }

  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      const data = await this.fetch()
      Object.assign(this, data)
    }
    const { legend, xAxis, yAxis, series } = this
    return { legend, xAxis, yAxis, series }
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
