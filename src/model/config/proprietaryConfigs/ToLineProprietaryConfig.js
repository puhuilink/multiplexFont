import {
  AreaStyle,
  BarItemStyle,
  ItemStyle,
  Legend,
  LineStyle,
  XAxis,
  YAxis
} from '@/model/config/proprietaryConfigs/index'
import _ from 'lodash'

export default class ToLineProprietaryConfig {
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
    decimalPoint = -1
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
