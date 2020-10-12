/**
 * 文本专有属性配置
 * Author: dong xing
 * Date: 2020/3/12
 * Time: 17:39
 * Email: dong.xing@outlook.com
 */

import _ from 'lodash'
import { ImageGraphic, Title } from './index'

// 默认轴线配置，不显示轴线
const defaultAxis = {
  show: false
}

export default class TextsProprietaryConfig {
  constructor ({
    title = {},
    xAxis = defaultAxis,
    yAxis = defaultAxis,
    graphic = {
      style: {
        image: './view__preview_default.jpg'
      }
    }
  }) {
    this.title = new Title(title)
    this.xAxis = xAxis
    this.yAxis = yAxis
    this.graphic = new ImageGraphic(graphic)
  }

  /**
   * 获取文本专有配置
   */
  getOption () {
    this.graphic.style.width = this.title.textStyle.fontSize + 30
    this.graphic.style.height = this.title.textStyle.fontSize + 30
    return Object.assign({}, _.cloneDeep(this), {
      title: this.title.getOption()
    })
  }
}
