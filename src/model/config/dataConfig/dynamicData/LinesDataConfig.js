// import { getComponentValues } from '@/api/controller/View'
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
        // FIXME: 新旧接口查询出数据条目有出入，可能与 id 格式：string / nunber 有关？
        // KpiCurrentService.getValue(this.resourceConfig, TimeRange.getOption.apply(this.timeRange)).then(data => {
        //   console.log('result', data)
        // })
        // const data = await getComponentValues(this.resourceConfig, TimeRange.getOption.apply(this.timeRange))
        const { selectedInstance, selectedKpi } = this.resourceConfig
        const { data } = await KpiCurrentService.getValue({
          selectedInstance,
          selectedKpi,
          timeRange: TimeRange.getOption.apply(this.timeRange),
          orderBy: { arising_time: 'asc' }
        })
        // console.log(data)
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
