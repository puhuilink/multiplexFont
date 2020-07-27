/**
* 极坐标专有属性
* Date: 2020/5/15
* Time: 5:27 下午
*/

import _ from 'lodash'
import { AngleAxis, BarItemStyle, Legend, Polar, PolarLinearColors, PolarMask, Radar, RadiusAxis } from './index'

/**
 * 极坐标专有属性配置
 * @param barType 柱形图类型 'single' | 'multiple'
 * @param barWidthType 柱条宽度类型 'auto' | 'custom'
 * @param barWidth 柱条宽度 'auto' | Number
 */
export default class PolarProprietaryConfig {
  constructor ({
    barItemStyle = {},
    legend = {},
    angleAxis = {},
    radiusAxis = {},
    polar = {},
    radar = {},
    polarLinearColors = {},
    polarMask = {}
  }) {
    this.barItemStyle = new BarItemStyle(barItemStyle)
    this.legend = new Legend(legend)
    this.angleAxis = new AngleAxis(angleAxis)
    this.radiusAxis = new RadiusAxis(radiusAxis)
    this.polar = new Polar(polar)
    this.radar = new Radar(radar)
    this.polarLinearColors = new PolarLinearColors(polarLinearColors)
    this.polarMask = new PolarMask(polarMask)
  }

  /**
   * 获取柱形图专有配置
   */
  getOption () {
    return Object.assign(_.cloneDeep(this), {
      itemStyle: this.barItemStyle.getOption(),
      polar: this.polar.getOption(),
      radar: this.radar.getOption(),
      polarLinearColors: this.polarLinearColors.getOption(),
      polarMask: this.polarMask.getOption()
    })
  }
}
