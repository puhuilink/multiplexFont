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
      const { xAxisType } = this
      try {
        const { data } = await this.fetch()
        // console.log(data)
        const groupByCi = _.groupBy(data, 'instanceLabel')
        const groupByInstance = {}
        Object.values(groupByCi).forEach((value) => {
          Object.assign(groupByInstance, { ..._.groupBy(value, 'instance_id') })
        })

        // TODO: 允许自定义图例显示内容
        // TODO: 待测试功能完整性
        const groupData = _.isEmpty(groupByInstance) ? groupByCi : groupByInstance

        const valueAxis = {
          type: 'value'
        }
        const categoryAxis = {
          type: 'category',
          data: Object.keys(
            xAxisType === 'RESOURCE' ? _.groupBy(data, 'kpiLabel') : _.groupBy(data, 'arising_time')
          )
        }

        this.legend = {
          data: Object.keys(
            // _.groupBy(data, 'instanceLabel')
            _.isEmpty(groupByInstance) ? groupByCi : groupByInstance
          )
        }
        this.xAxis = categoryAxis
        this.yAxis = valueAxis
        this.series = Object.keys(groupData).map(key => ({
          type: 'bar',
          name: key,
          data: groupData[key].map(item => item ? item.value : 0)
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
