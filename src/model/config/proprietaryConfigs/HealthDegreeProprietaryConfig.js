/*
 * 健康度专有配置对象
 */
import _ from 'lodash'
import { TextStyle, SeriesPie, SeriesGauge } from './index'

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
   * 获取标题配置
   */
  getOption () {
    return Object.assign(_.cloneDeep(this))
  }
}
class Scale {
  constructor ({
    show = false,
    type = 'dotted',
    color = 'red',
    radius = 85,
    content = {}
  }) {
    this.show = show
    this.type = type
    this.color = color
    this.radius = radius
    this.content = content
  }

  /**
   * 获取外围配置
   */
  getOption () {
    if (!this.show) {
      return null
    }
    console.log('hrere', this.type)
    let content
    switch (this.type) {
      case 'dotted':
        content = new SeriesGauge(this.content)
        content.id = '虚线外圆'
        content.axisTick.lineStyle.color = this.color
        content.radius = this.radius
        console.log('dotted', content)
        break
      case 'solid':
        content = new SeriesPie(this.content)
        content.id = '实线外圆'
        content.color = this.color
        content.radius = this.radius
        console.log('solid', content)
        break
      default:
        break
    }
    console.log('finally', content)
    return {
      ...content
    }
  }
}

export default class HealthDegreeProprietaryConfig {
  constructor ({
    title = {},
    innerCircle = {},
    scale = {}
  }) {
    this.title = new Title(title)
    this.innerCircle = new SeriesPie(innerCircle)
    this.scale = new Scale(scale)
  }

  /**
   * 获取健康度专有配置
   */
  getOption () {
    const series = [
      this.innerCircle.getOption(),
      this.scale.getOption()
    ]
    console.log(this.title, series)
    return Object.assign(_.cloneDeep(this), {
      // title: this.title.getOption()
      series
    })
  }
}
