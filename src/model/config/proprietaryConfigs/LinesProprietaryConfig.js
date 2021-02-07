/**
 * 折线图属性配置对象
 * Author: dong xing
 * Date: 2019/11/19
 * Time: 5:54 下午
 * Email: dong.xing@outlook.com
 */

import _ from 'lodash'
import {
  BarItemStyle,
  LineStyle, Legend, XAxis,
  YAxis, ItemStyle, AreaStyle
} from './index'

/**
 * 折现图专有属性配置
 * echarts 官方折线配置 https://www.echartsjs.com/zh/option.html#series-line
 * @param smooth 是否平滑曲线显示
 * @param showSymbol 是否显示标志点
 * @param symbol 标志点形状 'emptyCircle', 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
 * @param symbolSize 标志点大小
 * @param symbolRotate 标志点旋转角度
 */
export default class LinesProprietaryConfig {
  constructor ({
    barType = 'single',
    barItemStyle = {},
    smooth = true,
    showSymbol = true,
    symbol = 'emptyCircle',
    symbolSize = 4,
    symbolRotate = 0,
    lineStyle = {},
    testLint = {}, // 新增加 问题
    itemStyle = {},
    areaStyle = {},
    legend = {},
    xAxis = {},
    yAxis = {},
    decimalPoint = 0
  }) {
    // 是否平滑曲线显示
    this.smooth = smooth
    this.showSymbol = showSymbol
    this.symbol = symbol
    this.symbolSize = symbolSize
    this.symbolRotate = symbolRotate
    this.lineStyle = new LineStyle(lineStyle)
    this.testLint = new LineStyle(testLint)
    this.itemStyle = new ItemStyle(itemStyle)
    this.areaStyle = new AreaStyle(areaStyle || {})
    this.legend = new Legend(legend)
    this.xAxis = new XAxis(xAxis)
    this.yAxis = new YAxis(yAxis)
    this.barType = barType
    this.barItemStyle = new BarItemStyle(barItemStyle)
    this.decimalPoint = decimalPoint
  }

  /**
   * 获取折线图专有配置
   */
  getOption () {
    const result = Object.assign({}, this, {
      areaStyle: this.areaStyle.getOption(),
      xAxis: this.xAxis.getOption(),
      yAxis: this.yAxis.getOption(),
      // 此处为了复用使用了 BarItemStyle
      itemStyle: _.pick(this.barItemStyle.getOption(), ['color'])
    })
    // lineStyle 会覆盖 itemStyle
    return _.omit(result, ['lineStyle', 'barItemStyle'])
  }
}
