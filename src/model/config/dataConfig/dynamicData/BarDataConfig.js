import _ from 'lodash'
import { getComponentValues } from '@/api/controller/View'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: []
}

export default class BarDataConfig {
  constructor ({
    resourceConfig = {
      model: '',
      selectedInstance: [],
      selectedKpi: []
    }
  }) {
    this.resourceConfig = resourceConfig
    this.resetData()
  }

  /**
   * 与静态数据保持一致的数据结构
   * @param {Boolean} loadingDynamicData 是否请求动态数据
   * @returns {Promise<any>}
   */
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      try {
        // 拿到的数据是一条kpi与一条ci的搭配数组
        const res = await getComponentValues(this.resourceConfig)
        // // 按 ci 进行分组
        // const groupedData = _.groupBy(res, 'instanceLabel')
        // 按 kpi 进行分组
        const groupedData = _.groupBy(res, 'kpiLabel')
        const valueAxis = {
          type: 'value'
        }
        const categoryAxis = {
          type: 'category',
          data: Object.keys(groupedData)
        }
        // 纵向 / 横向图
        // const isVertical = false
        const isVertical = true

        this.legend = {}
        this.xAxis = isVertical ? categoryAxis : valueAxis
        this.yAxis = !isVertical ? categoryAxis : valueAxis
        this.series = Object.keys(groupedData).map(key => ({
          type: 'bar',
          name: key,
          data: groupedData[key].map(item => item ? item.value : 0)
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
