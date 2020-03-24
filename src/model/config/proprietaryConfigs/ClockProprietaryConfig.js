import _ from 'lodash'
import { Title } from './index'

// 默认轴线配置，不显示轴线
const defaultAxis = {
  show: false
}

/**
 * 时钟专有属性配置
 */
export default class ClockProprietaryConfig {
  constructor ({
    title = {},
    xAxis = defaultAxis,
    yAxis = defaultAxis
  }) {
    this.title = new Title(title)
    this.xAxis = xAxis
    this.yAxis = yAxis
  }

  /**
   * 获取文本专有配置
   */
  getOption () {
    return Object.assign(_.cloneDeep(this), {
      // TODO
      // title: this.title.getOption()
    })
  }
}
