/*
 * 环度专有属性配置项
 */
import _ from 'lodash'
// eslint-disable-next-line
import echartsLiquidfill from 'echarts-liquidfill'

class InnerCircle {
  constructor ({
    type = 'liquidFill',
    radius = '80%',
    color = '#195ba6',
    center = ['50%', '50%'],
    data = [
      { value: 1 }
    ],
    itemStyle = {
      opacity: 1,
      color: '#195ba6'
    },
    backgroundStyle = {
      borderWidth: 2,
      borderColor: '#1789fb',
      color: '#fff'
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
      color: '#fff'
    }
  }) {
    this.type = type
    this.radius = radius
    this.color = color
    this.center = center
    this.data = data
    this.backgroundStyle = backgroundStyle
    this.itemStyle = itemStyle
    this.outline = outline
    this.label = label
  }
}

export default class DegreeRingProprietaryConfig {
  constructor ({
    type = '',
    innerCircle = {}
  }) {
    this.type = type
    this.innerCircle = new InnerCircle(innerCircle)
  }

  /**
   * 获取健康度专有配置
   */
  getOption () {
    return Object.assign(_.cloneDeep(this), {
      series: this.innerCircle
    })
  }
}
