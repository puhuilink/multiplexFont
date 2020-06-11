import _ from 'lodash'
import { AxisDynamicDataConfig } from './index'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: [],
  originalData: null
}

export default class BarDataConfig extends AxisDynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      try {
        const { data } = await this.fetch()
        this.originalData = data
      } catch (e) {
        this.resetData()
        throw e
      }
    }
    const { legend, xAxis, yAxis, series } = this.getComposedData()
    console.log(_.cloneDeep(this.getComposedData()))
    return _.cloneDeep({ legend, xAxis, yAxis, series })
  }

  resetData () {
    this.originalData = _.cloneDeep(initialOption)
  }
}
