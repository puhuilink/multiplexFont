/*
 * 环度专有属性配置项
 */
import { ThresholdColorRule } from './index'
// eslint-disable-next-line
import echartsLiquidfill from 'echarts-liquidfill'

class InnerCircle {
  constructor ({
    type = 'liquidFill',
    radius = '80%',
    color = '#195ba6',
    center = ['50%', '50%'],
    amplitude = 0,
    waveAnimation = 0,
    data = [
      { value: 1 }
    ],
    itemStyle = {
      opacity: 0,
      color: '#195ba6'
    },
    backgroundStyle = {
      borderWidth: 2,
      borderColor: '#1789fb',
      color: 'rgba(25, 91, 166, 1)'
    },
    outline = {
      show: false,
      itemStyle: {
        borderWidth: 4,
        borderColor: '#1789fb',
        borderType: 'dashed'
      }
    },
    label = {
      formatter: '100',
      fontSize: 20,
      color: '#fff',
      insideColor: 'rgba(255,255,255,1)'
    },
    decimalPoint = 1
  }) {
    this.type = type
    this.radius = radius
    this.color = color
    this.center = center
    this.amplitude = amplitude
    this.waveAnimation = waveAnimation
    this.data = data
    this.backgroundStyle = backgroundStyle
    this.itemStyle = itemStyle
    this.outline = outline
    this.label = label
    this.decimalPoint = decimalPoint
  }
}

export const DEGREE_TYPE_HEALTH_DEGREE = 'healthDegree'
export const DEGREE_TYPE_PROGRESS_RING = 'progressRing'
export const DEGREE_TYPE_HEALTH_RING = 'healthRing'

export default class DegreeRingProprietaryConfig {
  constructor ({
    type = DEGREE_TYPE_HEALTH_DEGREE,
    innerCircle = {},
    thresholdColorRule = {}
  }) {
    this.type = type
    this.innerCircle = new InnerCircle(innerCircle)
    this.thresholdColorRule = new ThresholdColorRule(thresholdColorRule)
  }

  /**
   * 获取健康度专有配置
   */
  getOption () {
    const { innerCircle, ...rest } = this
    const { decimalPoint = 0 } = innerCircle
    return Object.assign({}, rest, {
      series: this.innerCircle,
      decimalPoint
    })
  }
}
