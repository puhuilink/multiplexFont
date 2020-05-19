import { DynamicDataConfig } from './index'
import _ from 'lodash'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: []
}

export default class LinesDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      try {
        const { data } = await this.fetch()
        const groupByCi = _.groupBy(data, 'instanceLabel')
        const groupByTime = _.groupBy(data, 'arising_time')
        const valueAxis = {
          type: 'value'
        }
        const categoryAxis = {
          type: 'category',
          data: Object.keys(groupByTime)
        }

        this.legend = {
          data: Object.keys(groupByCi)
        }
        // TODO: 交换 x / y 轴配置实现 纵向 / 横向切换
        this.xAxis = categoryAxis
        this.yAxis = valueAxis
        this.series = Object.keys(groupByCi).map(key => ({
          type: 'line',
          name: key,
          data: groupByCi[key].map(item => item ? item.value : 0)
        }))
      } catch (e) {
        this.resetData()
        throw e
      }
    }
    const { legend, xAxis, yAxis, series } = this
    return _.cloneDeep({ legend, xAxis, yAxis, series })
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
