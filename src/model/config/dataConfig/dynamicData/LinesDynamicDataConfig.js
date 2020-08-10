import { DynamicDataConfig } from './common/index'
import _ from 'lodash'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: []
}

export default class LinesDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      try {
        const data = await this.fetch()
        const groupByCollectTime = _.groupBy(data, 'collect_time')
        const groupByHostAlias = _.groupBy(data, 'host_alias')
        console.log('groupByHostAlias', groupByHostAlias)
        const valueAxis = {
          type: 'value'
        }
        const categoryAxis = {
          type: 'category',
          data: Object.keys(groupByCollectTime)
        }

        this.legend = {
          data: Object.keys(groupByHostAlias)
        }
        this.xAxis = categoryAxis
        this.yAxis = valueAxis
        this.series = Object.entries(groupByHostAlias).map(([hostAlias, data]) => ({
          type: 'line',
          name: hostAlias,
          data: data.map(({ metric_value_str, metric_value }) => metric_value_str || metric_value)
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
