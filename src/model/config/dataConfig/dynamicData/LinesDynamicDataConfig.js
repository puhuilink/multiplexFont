import { AxisDynamicDataConfig } from './common/index'
import _ from 'lodash'

const initialOption = {
  legend: {},
  xAxis: {},
  yAxis: {},
  series: []
}

export default class LinesDynamicDataConfig extends AxisDynamicDataConfig {
  constructor (props) {
    super({
      ...props,
      xAxisType: 'TIME'
    })
  }

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
