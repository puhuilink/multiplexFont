import _ from 'lodash'
import { getComponentValues } from '@/api/controller/View'

export default class BarDataConfig {
  constructor ({
    resourceConfig = {
      model: '',
      selectedInstance: [],
      selectedKpi: []
    }
  }) {
    this.resourceConfig = resourceConfig
  }

  /**
   * 与静态数据保持一致的数据结构
   * @returns {Promise<any>}
   */
  async getOption () {
    try {
      // 拿到的数据是一条kpi与一条ci的搭配数组
      const res = await getComponentValues(this.resourceConfig)
      // 按 ci 进行分组
      const groupedData = _.groupBy(res, 'instanceLabel')
      // TODO: 单列 / 多列？
      return {
        legend: {},
        xAxis: {
          type: 'category',
          data: Object.keys(groupedData)
        },
        yAxis: {
          type: 'value'
        },
        singleSeries: Object.keys(groupedData).map(key => ({
          type: 'bar',
          stack: null,
          name: key,
          data: groupedData[key].map(item => item ? item.value : 0)
        }))
      }
    } catch (e) {
      return {
        legend: {},
        xAxis: {},
        yAxis: {},
        singleSeries: []
      }
    }
  }
}
