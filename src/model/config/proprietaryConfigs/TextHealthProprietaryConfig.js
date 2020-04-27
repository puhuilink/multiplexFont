/**
* 文本健康度专有属性配置
*/

import _ from 'lodash'
import { Title } from './index'

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
      title: this.title.getOption()
    })
  }
}
