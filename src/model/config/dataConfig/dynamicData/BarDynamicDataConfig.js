import _ from 'lodash'
import { AxisDynamicDataConfig } from './common/index'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: [],
  originalData: null
}

export default class BarDynamicDataConfig extends AxisDynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      const data = await this.fetch()
      Object.assign(this, data)
    }
    const { legend, xAxis, yAxis, series } = this
    return { legend, xAxis, yAxis, series }
  }

  resetData () {
    Object.assign(this, _.cloneDeep(initialOption))
  }
}
