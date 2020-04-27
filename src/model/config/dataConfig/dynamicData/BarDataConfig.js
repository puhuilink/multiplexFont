import _ from 'lodash'
import { getComponentValues } from '@/api/controller/View'
// import { KpiCurrentService } from '@/api-hasura'

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
        // FIXME: 新旧接口查询出数据条目有出入，可能与 id 格式：string / nunber 有关？
        // const res = await KpiCurrentService.getValue(this.resourceConfig)
        // console.log(res)
        // getComponentValues(this.resourceConfig).then(res => {
        //   console.log('res', res)
        // })
        const groupByKpi = _.groupBy(res, 'kpiLabel')
        const groupByCi = _.groupBy(res, 'instanceLabel')
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
