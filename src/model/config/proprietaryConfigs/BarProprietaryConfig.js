/**
 * 柱形图属性配置对象
 * Author: dong xing
 * Date: 2019/11/19
 * Time: 5:54 下午
 * Email: dong.xing@outlook.com
 */

import { BarItemStyle, Legend, XAxis, YAxis } from './index'

/**
 * 折现图专有属性配置
 * @param barType 柱形图类型 'single' | 'multiple'
 * @param barWidthType 柱条宽度类型 'auto' | 'custom'
 * @param barWidth 柱条宽度 'auto' | Number
 */
export default class BarProprietaryConfig {
  constructor ({
    barType = 'single',
    barItemStyle = {},
    legend = {},
    barWidthType = 'auto',
    barWidth = 'auto',
    reverse = false,
    xAxis = {},
    yAxis = {},
    decimalPoint = -1
  }) {
    this.barType = barType
    this.legend = new Legend(legend)
    this.barItemStyle = new BarItemStyle(barItemStyle)
    this.barWidthType = barWidthType
    this.barWidth = barWidth
    this.xAxis = new XAxis(xAxis)
    this.yAxis = new YAxis(yAxis)
    this.reverse = reverse
    this.decimalPoint = decimalPoint
  }

  /**
   * 获取柱形图专有配置
   */
  getOption () {
    return Object.assign({}, this, {
      itemStyle: this.barItemStyle.getOption()
    })
  }
}
