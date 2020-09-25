import { DynamicDataConfig } from './common/index'
import _ from 'lodash'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: []
}

export default class LinesDynamicDataConfig extends DynamicDataConfig {
  async fetch () {
    const dataList = await super.fetch()
    const groupByName = _.groupBy(dataList, 'name')
    const categoryList = Object.keys(groupByName)
    const option = {
      legend: {
        data: categoryList
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: _.uniq(
          dataList.map(({ time }) => time)
        )
      },
      yAxis: {
        type: 'value'
      },
      series: categoryList.map(category => ({
        name: category,
        data: groupByName[category].map(({ data }) => data)
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

  // TODO: 统一出口入口
  async getOverviewOption (loadingDynamicData) {
    if (loadingDynamicData) {
      const dataList = await this.overviewConfig.fetch()
      const groupByLegend = _.groupBy(dataList, 'legend')
      const legendList = Object.keys(groupByLegend)
      const option = {
        legend: {
          data: legendList
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: _.uniq(
            dataList.map(({ time }) => time)
          )
        },
        yAxis: {
          type: 'value'
        },
        series: legendList.map(legend => ({
          name: legend,
          data: groupByLegend[legend].map(({ data }) => data)
        }))
      }
      Object.assign(this, option)
    }
    const { legend, xAxis, yAxis, series } = this
    return { legend, xAxis, yAxis, series }
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
