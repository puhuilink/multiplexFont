import _ from 'lodash'
import { SeriesGauge } from './index'

/**
 * 仪表盘专有属性配置
 */
export default class GuageProprietaryConfig {
  constructor ({
    series = {},
    backgroundColor = '#ddd'
  }) {
    this.series = new SeriesGauge(series)
    this.backgroundColor = backgroundColor
  }

  /**
   * 获取文本专有配置
   */
  getOption () {
    return Object.assign(_.cloneDeep(this), {
      series: this.series,
      backgroundColor: this.backgroundColor
    })
  }
}
