/**
* 极坐标数据配置
* Date: 2020/5/20
* Time: 1:40 下午
*/

import _ from 'lodash'
import { DynamicDataConfig } from './common/index'

const initialOption = {
  legend: {},
  series: []
}

export default class PolarDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      try {
        const data = await this.fetch()
        const groupLabel = _.groupBy(data, 'instanceLabel')
        const groupByCi = _.groupBy(data, 'kpi_code')
        const formatData = Object.keys(groupByCi).map(key => {
          const group = _.groupBy(groupByCi[key], 'ci_id')
          const items = Object.values(group).map(item => {
            let target = {}
            if (Array.isArray(item) && item.length > 1) {
              target = {
                ci: item[0].instanceLabel,
                value: item.reduce((store, current) => {
                  return store + (current.value || 0)
                }, 0),
                kpi: item[0].kpiLabel
              }
            } else {
              target = {
                ci: item[0].instanceLabel,
                value: item[0].value,
                kpi: item[0].kpiLabel
              }
            }
            return target
          })
          return items
        })
        this.series = [{
          data: Object.keys(groupLabel).map(label => {
            return {
              name: label,
              value: formatData.map(item => {
                const target = item.find(part => part.ci === label)
                return target ? target.value : 0
              })
            }
          })
        }]
        this.legend = {
          data: formatData.length > 0 ? formatData.map(item => Array.isArray(item) ? item[0].kpi : '') : []
        }
        this.angleAxis = {
          data: Object.keys(groupLabel)
        }
      } catch (e) {
        this.resetData()
        throw e
      }
    }
    const { legend, angleAxis, series } = this
    return _.cloneDeep({ legend, angleAxis: angleAxis || {}, series })
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
