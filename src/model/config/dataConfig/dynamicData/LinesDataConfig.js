import { getComponentValues } from '@/api/controller/View'
import { TimeRange } from './index'
import _ from 'lodash'
import { KpiCurrentService } from '@/api-hasura'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: []
}
export default class LinesDataConfig {
  constructor ({
    resourceConfig = {
      model: '',
      selectedInstance: [],
      selectedKpi: []
    },
    refreshTime = 0,
    // 外部 Ci 是否可用
    externalCi = true,
    timeRange = new TimeRange()
  }) {
    this.resourceConfig = resourceConfig
    this.refreshTime = refreshTime
    this.externalCi = externalCi
    this.timeRange = timeRange
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
        // 没有记录时返回长度为0的数组
        // 引入配置时，timeRange 未经实例化，可以直接调用静态方法获取时间段
        KpiCurrentService.getValue(this.resourceConfig, TimeRange.getOption.apply(this.timeRange)).then(res => {
          console.log('res', res)
        })
        const res = await getComponentValues(this.resourceConfig, TimeRange.getOption.apply(this.timeRange))
        // console.log(
        //   res
        // )
        // const [data] = res
        // return {
        //   value: data ? data.value : 0
        // }
        const groupByKpi = _.groupBy(res, 'kpiLabel')
        const groupByCi = _.groupBy(res, 'instanceLabel')
        console.log(
          groupByKpi,
          groupByCi
        )
        const valueAxis = {
          type: 'value'
        }
        const categoryAxis = {
          type: 'category',
          data: Object.keys(groupByKpi)
        }

        this.legend = {
          data: Object.keys(_.groupBy(res, 'instanceLabel'))
        }
        // TODO: 交换 x / y 轴配置实现 纵向 / 横向切换
        this.xAxis = categoryAxis
        this.yAxis = valueAxis
        this.series = Object.keys(groupByCi).map(key => ({
          type: 'line',
          // name: key,
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
