import _ from 'lodash'
import { DynamicDataConfig } from './index'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: []
}

export default class BarDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      try {
        const { data } = await this.fetch()
        const groupByKpi = _.groupBy(data, 'kpiLabel')
        const groupByCi = _.groupBy(data, 'instanceLabel')
        const valueAxis = {
          type: 'value'
        }
        const categoryAxis = {
          type: 'category',
          data: Object.keys(groupByKpi)
        }

        this.legend = {
          data: Object.keys(_.groupBy(data, 'instanceLabel'))
        }
        // TODO: 交换 x / y 轴配置实现 纵向 / 横向切换
        this.xAxis = categoryAxis
        this.yAxis = valueAxis
        this.series = Object.keys(groupByCi).map(key => ({
          type: 'bar',
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
