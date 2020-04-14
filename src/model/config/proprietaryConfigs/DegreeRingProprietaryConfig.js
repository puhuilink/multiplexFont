/*
 * 环度专有属性配置项
 */
import _ from 'lodash'
import { TextStyle } from './index'
// eslint-disable-next-line
import echartsLiquidfill from 'echarts-liquidfill'

class Title {
  constructor ({
    text = 85,
    left = 'center',
    top = 'center',
    textStyle = {
      color: '#fff',
      fontSize: 58,
      fontFamily: 'DINAlternate-Bold'
    }
  }) {
    this.text = text
    this.left = left
    this.top = top
    this.textStyle = new TextStyle(textStyle)
  }

  /**
   * 获取圆内标题配置
   */
  getOption () {
    return Object.assign(_.cloneDeep(this))
  }
}

class InnerCircle {
  constructor ({
    type = 'liquidFill',
    radius = '150',
    color = '#195ba6',
    center = ['50%', '50%'],
    data = [
      { value: 0.1 }
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
      formatter: function (param) {
        // return param.seriesName + '\n'
        // + param.name + '\n'
        // + 'Value: ' + param.value;
        return param.value
      },
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
    title = {},
    innerCircle = {},
    innerRing = {},
    excircle = {}
  }) {
    this.type = type
    this.title = new Title(title)
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
