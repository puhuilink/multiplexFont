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
      try {
        this.originalData = await this.fetch()
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
