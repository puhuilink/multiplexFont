import _ from 'lodash'
import { getComponentValues } from '@/api/controller/View'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  singleSeries: [],
  multipleSeries: []
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
    Object.assign(this, _.cloneDeep(initialOption))
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
        console.log(res)
        // // 按 ci 进行分组
        // const groupedData = _.groupBy(res, 'instanceLabel')
        // 按 kpi 进行分组
        const groupedData = _.groupBy(res, 'kpiLabel')
        // TODO: 单列 / 多列？
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
        // 是否堆叠
        // const stack = false
        const stack = '总量'

        this.legend = {}
        this.xAxis = isVertical ? categoryAxis : valueAxis
        this.yAxis = !isVertical ? categoryAxis : valueAxis
        this.singleSeries = Object.keys(groupedData).map(key => ({
          type: 'bar',
          stack: stack,
          name: key,
          data: groupedData[key].map(item => item ? item.value : 0)
        }))
        this.multipleSeries = []
      } catch (e) {
        Object.assign(this, _.cloneDeep(initialOption))
        throw e
      }
    }
    const { legend, xAxis, yAxis, singleSeries, multipleSeries } = this
    return _.cloneDeep({ legend, xAxis, yAxis, singleSeries, multipleSeries })
  }
}
