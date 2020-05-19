import _ from 'lodash'
// import { getComponentValues } from '@/api/controller/View'
import { KpiCurrentService } from '@/api-hasura'
import { DynamicDataConfig, TimeRange } from './index'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: []
}

export default class BarDataConfig extends DynamicDataConfig {
  /**
   * 与静态数据保持一致的数据结构
   * @param {Boolean} loadingDynamicData 是否请求动态数据
   * @returns {Promise<any>}
   */
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      try {
        // const data = await getComponentValues(this.resourceConfig)
        // FIXME: 新旧接口查询出数据条目有出入，可能与 id 格式：string / number 有关？
        // const { data } = await KpiCurrentService.getValue(this.resourceConfig)
        const { selectedInstance, selectedKpi, detailInstance } = this.resourceConfig
        const { data } = await KpiCurrentService.getValue({
          selectedInstance,
          selectedKpi,
          detailInstance,
          timeRange: TimeRange.getOption.apply(this.timeRange),
          orderBy: { arising_time: 'asc' }
        })
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
