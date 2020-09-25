/**
* 文本健康度专有属性配置
*/

import _ from 'lodash'
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
    xAxis = defaultAxis,
    yAxis = defaultAxis,
    thresholdColorRule = {}
  }) {
    this.title = new Title(title)
    this.xAxis = xAxis
    this.yAxis = yAxis
    this.thresholdColorRule = new ThresholdColorRule(thresholdColorRule)
  }

  /**
   * 获取文本专有配置
   */
  getOption () {
    return Object.assign({}, _.cloneDeep(this), {
      title: _.cloneDeep(this.title.getOption())
    })
  }
}
