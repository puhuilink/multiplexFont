/**
* 文本健康度专有属性配置
*/

import { Title, ThresholdColorRule } from './index'

// 默认轴线配置，不显示轴线
const defaultAxis = {
  show: false
}

export default class TextsProprietaryConfig {
  constructor ({
    title = {
      text: 'N/A'
    },
    type = 'default',
    xAxis = defaultAxis,
    yAxis = defaultAxis,
    thresholdColorRule = {},
    decimalPoint = 0
  }) {
    this.title = new Title(title)
    this.type = type
    this.xAxis = xAxis
    this.yAxis = yAxis
    this.thresholdColorRule = new ThresholdColorRule(thresholdColorRule)
    this.decimalPoint = decimalPoint
  }

  /**
   * 获取文本专有配置
   */
  getOption () {
    return Object.assign({}, this, {
      title: this.title.getOption()
    })
  }
}
