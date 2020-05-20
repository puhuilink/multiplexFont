/**
 * 通用echarts对象
 * Author: dong xing
 * Date: 2019/11/25
 * Time: 6:04 下午
 * Email: dong.xing@outlook.com
 */
import _ from 'lodash'

/**
 * 图例
 * @param orient 'horizontal' | 'vertical'
 * @param icon 'circle' | 'rect' | 'roundRect' | 'triangle' |  'diamond' | 'pin' | 'arrow' | 'none'
 */
class Legend {
  constructor ({
    show = false,
    orient = 'horizontal',
    icon = 'circle',
    top = 'auto',
    right = 'auto',
    bottom = 'auto',
    left = 'auto',
    textStyle = {}
  }) {
    this.show = show
    this.orient = orient
    this.top = top
    this.right = right
    this.bottom = bottom
    this.left = left
    this.icon = icon
    this.textStyle = new TextStyle(textStyle)
  }
}

/**
 * 折线样式
 * @param type 'solid' | 'dashed' | 'dotted'
 */
class LineStyle {
  constructor ({
    color = 'rgba(0,0,0,1)',
    width = 2,
    type = 'solid'
  }) {
    this.color = color
    this.width = width
    this.type = type
  }
}

/**
 * 通用元素样式
 */
class ItemStyle {
  constructor ({
    color = 'rgba(255, 0, 0, 1)',
    borderColor = 'rgba(0, 0, 0, 1)',
    borderWidth = 1,
    borderType = 'solid'
  }) {
    this.color = color
    this.borderColor = borderColor
    this.borderWidth = borderWidth
    this.borderType = borderType
  }
}

/**
 * 区域样式
 * @param showArea 显示区域样式
 * @param colorType 颜色类型 single | linear
 * @param color 区域颜色
 */
class AreaStyle {
  constructor ({
    show = false,
    colorType = 'single',
    color = 'rgba(0, 0, 0, 1)'
  }) {
    this.show = show
    this.colorType = colorType
    this.color = color
  }

  getOption () {
    if (!this.show) {
      return null
    }
    let color
    switch (this.colorType) {
      case 'single':
        color = this.color
        break
      case 'linear':
        color = {
          type: 'linear',
          x: 1,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: this.color.start
            },
            {
              offset: 1,
              color: this.color.end
            }
          ]
        }
        break
      default:
        break
    }
    return {
      color
    }
  }
}

/**
 * 柱形图与折线图形样式
 * @param type 类型 'single' | 'combination' | 'linear'
 * @param colorType 颜色类型 'default' | 'custom'
 */
class BarItemStyle {
  constructor (argus = {}) {
    // 允许传入部分参数，未指定项赋予默认值
    const { type, color, colorType, colorScheme, barBorderRadius } = Object.assign({}, {
      type: 'single',
      colorType: 'default',
      colorScheme: 'default',
      color: 'rgba(7,171,253,1)',
      barBorderRadius: [0, 0, 0, 0]
    }, argus)
    this.type = type
    this.colorType = colorType
    this.colorScheme = colorScheme
    this.color = color
    this.barBorderRadius = barBorderRadius
  }

  /**
   * 映射为 echarts 柱形图 itemStyle 样式
   * @returns {{color: (string|*[]), barBorderRadius: number[]}}
   */
  getOption () {
    let color
    switch (this.type) {
      case 'single':
        color = this.color
        break
      case 'combination':
        color = [...this.color]
        break
      case 'linear':
        color = [...this.color].map(({ start, end }) => ({
          type: 'linear',
          x: 1,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: start
            },
            {
              offset: 1,
              color: end
            }
          ]
        }))
        break
      default:
        color = 'rgba(7,171,253,1)'
        break
    }
    return {
      color,
      barBorderRadius: this.barBorderRadius
    }
  }
}

/**
 * 饼图图形样式
 * @param type 类型 'combination' | 'linear'
 */
class PieItemStyle extends ItemStyle {
  constructor ({
    type = 'combination',
    colorType = 'default',
    colorScheme = 'default',
    borderWidth = 0,
    color = [
      '#c23531', '#2f4554', '#61a0a8', '#d48265',
      '#91c7ae', '#749f83', '#ca8622', '#bda29a',
      '#6e7074', '#546570', '#c4ccd3'
    ],
    ...otherOptions
  }) {
    super({
      color,
      borderWidth,
      ...otherOptions
    })
    this.type = type
    this.colorType = colorType
    this.colorScheme = colorScheme
  }

  /**
   * 映射为 echarts 饼图 itemStyle 样式
   * @returns {{color: (*[]|string), barBorderRadius: (number[]|number)}}
   */
  getOption () {
    let color
    switch (this.type) {
      case 'combination':
        color = [...this.color]
        break
      case 'linear':
        color = [...this.color].map(({ start, end }) => ({
          type: 'linear',
          x: 1,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: start
            },
            {
              offset: 1,
              color: end
            }
          ]
        }))
        break
      default:
        color = 'rgba(7,171,253,1)'
        break
    }
    return {
      ..._.omit(_.cloneDeep(this), ['color', 'type', 'colorType', 'colorScheme']),
      color
    }
  }
}

/**
 * 通用文本样式配置
 * @param color 文本颜色
 * @param fontStyle 文本风格 'normal' | 'italic'
 * @param fontSize 文本大小 12
 * @param fontWeight 文本粗细 'normal' | 'lighter' | 'bold' | 'bolder'
 */
class TextStyle {
  constructor ({
    color = 'rgba(0, 0, 0, 1)',
    fontStyle = 'normal',
    fontSize = 12,
    fontWeight = 'normal'
  }) {
    this.color = color
    this.fontStyle = fontStyle
    this.fontSize = fontSize
    this.fontWeight = fontWeight
  }
}

/**
 * 饼图标签配置
 * @param show 显示
 * @param position 标签的位置 'outside' | 'inside'
 * @param alignTo 标签对齐方式 'none' | 'labelLine' | 'edge'
 */
class PieLabel extends TextStyle {
  constructor ({
    show = true,
    position = 'outside',
    alignTo = 'none',
    ...props
  }) {
    super(props)
    this.show = show
    this.position = position
    this.alignTo = alignTo
  }

  /**
   * 映射饼图文本标签配置
   * @returns {*}
   */
  getOption () {
    return Object.assign(
      _.cloneDeep(_.omit(this, ['color']))
    )
  }
}

/**
 * 位置对象
 * @param mode 位置所处模式 'center' | 'center_left' | 'center_right' | 'top_center' | 'bottom_center' | 'custom'
 * @param editablePosition 可编辑位置
 * @param top 居上位置 'center' | 'auto' | Number
 * @param bottom 居下位置 'auto' | 'center' | Number
 * @param top 居上位置 'center' | 'auto' | Number
 * @param top 居上位置 'auto' | 'center' | Number
 */
class Position {
  constructor ({
    mode = 'center',
    editablePosition = [],
    top = 'center',
    bottom = 'auto',
    left = 'center',
    right = 'auto'
  }) {
    this.mode = mode
    this.editablePosition = editablePosition
    this.top = top
    this.bottom = bottom
    this.left = left
    this.right = right
  }

  /**
   * 获取位置模式对应配置
   * @returns {{top: string, left: string, bottom: string, right: string}|{top: string, left: number, bottom: string, right: string}|{top: string, left: string, bottom: string, right: number}|{top: number, left: string, bottom: string, right: string}|{top: string, left: string, bottom: number, right: string}}
   */
  getOption () {
    let position
    switch (this.mode) {
      case 'center':
        position = { top: 'center', bottom: 'auto', left: 'center', right: 'auto' }
        break
      case 'center_left':
        position = { top: 'center', bottom: 'auto', left: this.left, right: 'auto' }
        break
      case 'center_right':
        position = { top: 'center', bottom: 'auto', left: 'auto', right: this.right }
        break
      case 'top_center':
        position = { top: this.top, bottom: 'auto', left: 'center', right: 'auto' }
        break
      case 'bottom_center':
        position = { top: 'auto', bottom: this.bottom, left: 'center', right: 'auto' }
        break
      case 'custom':
        position = { top: this.top, bottom: this.bottom, left: this.left, right: this.right }
        break
      default:
        position = { top: 'center', bottom: 'auto', left: 'center', right: 'auto' }
        break
    }
    return position
  }
}

/**
 * 标题对象
 * 官方配置 https://www.echartsjs.com/zh/option.html#title
 * @param text 文本
 * @param link 文本链接地址  'blank' | 'self'
 * @param target 文本超链接打开方式
 * @param textStyle 文本样式
 * @param top 文本距离上边距位置
 * @param bottom 文本距离底边距位置
 * @param left 文本距离左边距位置
 * @param right 文本距离右边距位置
 */
class Title {
  constructor ({
    text = '文本',
    link = '',
    target = 'blank',
    textStyle = {
      fontSize: 24
    },
    position = {}
  }) {
    this.text = text
    this.link = link
    this.target = target
    this.textStyle = new TextStyle(textStyle)
    this.position = new Position(position)
  }

  /**
   * 获取标题配置
   */
  getOption () {
    return Object.assign(_.cloneDeep(this), this.position.getOption())
  }
}

/**
 * 坐标轴轴线相关配置
 * @param show 是否显示坐标轴线
 * @param lineStyle 坐标轴轴线样式
 */
class AxisLine {
  constructor ({
    show = true,
    lineStyle = {}
  }) {
    this.show = show
    this.lineStyle = new LineStyle(lineStyle)
  }
}

/**
 * 坐标轴刻度相关设置
 * @param show: 是否显示坐标轴刻度
 * @param length: 坐标轴刻度的长度
 * @param lineStyle 刻度线样式
 */
class AxisTick {
  constructor ({
    show = true,
    length = 5,
    lineStyle = {}
  }) {
    this.show = show
    this.length = length
    this.lineStyle = new LineStyle(lineStyle)
  }
}

/**
 * 坐标轴刻度标签的相关设置
 * @param show 是否显示刻度标签
 * @param rotate 刻度标签旋转的角度 -90 ~ 90
 * @param margin 刻度标签与轴线之间的距离
 */
class AxisLabel extends TextStyle {
  constructor ({
    show = true,
    rotate = 0,
    margin = 8,
    ...props
  }) {
    super(props)
    this.show = show
    this.rotate = rotate
    this.margin = margin
  }
}

/**
 * 坐标轴区域分隔线相关设置
 * @param show 是否显示分隔线
 * @param lineStyle 分隔线线样式
 */
class SplitLine {
  constructor ({
    show = false,
    lineStyle = {}
  }) {
    this.show = show
    this.lineStyle = new LineStyle(lineStyle)
  }
}

/**
 * 极坐标角度轴
 * @param type 坐标轴类型
 * @param data 坐标轴数据
 * @param axisLabel 坐标轴文本配置
 */
class AngleAxis {
  constructor ({
    type = 'category',
    data = [],
    axisLabel = {},
    axisTick = {
      show: false
    }
  }) {
    this.type = type
    this.data = data
    this.axisLabel = new AxisLabel(axisLabel)
    this.axisTick = new AxisTick(axisTick)
  }
}

/**
 * 极坐标径向轴
 */
class RadiusAxis {
  constructor ({
    zlevel = 6,
    splitNumber = 5,
    axisLine = {},
    splitLine = {},
    axisLabel = {},
    axisTick = {
      show: false
    }
  }) {
    this.zlevel = zlevel
    this.splitNumber = splitNumber
    this.axisLine = new AxisLine(axisLine)
    this.splitLine = new SplitLine(splitLine)
    this.axisLabel = new AxisLabel(axisLabel)
    this.axisTick = new AxisTick(axisTick)
  }
}

/**
 * 极坐标遮罩
 */
class PolarMask {
  constructor ({
    show = false,
    color = 'rgba(0, 0, 0, 1)'
  }) {
    this.show = show
    this.color = color
  }

  getOption () {
    return {
      show: this.show,
      item: {
        value: 1,
        name: 'mask',
        itemStyle: {
          color: this.show ? this.color : 'rgba(0, 0, 0, 0)'
        }
      }
    }
  }
}

/**
 * 极坐标配置
 */
class Polar {
  constructor ({
    radius = {
      inside: '20%',
      outside: '80%'
    }
  }) {
    this.radius = radius
  }

  /**
   * 获取极坐标配置
   * @returns {{radius: [string, string]}}
   */
  getOption () {
    const { inside, outside } = this.radius
    return {
      radius: [inside, outside]
    }
  }
}

/**
 * 极坐标背景渐变颜色
 */
class PolarLinearColors {
  constructor ({
    left = {
      start: 'rgba(21,92,113,1)',
      end: 'rgba(18,61,112,1)'
    },
    right = {
      start: 'rgba(55,60,185,1)',
      end: 'rgba(130,45,143,1)'
    }
  }) {
    this.left = left
    this.right = right
  }

  /**
   * 获得极坐标背景渐变颜色配置
   * @returns {({name: string, itemStyle: {color: {r: number, x: number, y: number, colorStops: [{offset: number, color: string}, {offset: number, color: string}], type: string}}, value: number}|{name: string, itemStyle: {color: {r: number, x: number, y: number, colorStops: [{offset: number, color: string}, {offset: number, color: string}], type: string}}, value: number})[]}
   */
  getOption () {
    const { start: leftStartColor, end: leftEndColor } = this.left
    const { start: rightStartColor, end: rightEndColor } = this.right
    return [
      {
        value: 1,
        name: 'right',
        itemStyle: {
          color: {
            type: 'radial',
            x: 0,
            y: 0.5,
            r: 1,
            colorStops: [{
              offset: 0.5, color: rightStartColor // 0% 处的颜色
            }, {
              offset: 1, color: rightEndColor // 100% 处的颜色
            }]
          }
        }
      },
      {
        value: 1,
        name: 'left',
        itemStyle: {
          color: {
            type: 'radial',
            x: 1,
            y: 0.5,
            r: 1,
            colorStops: [{
              offset: 0.5, color: leftStartColor // 0% 处的颜色
            }, {
              offset: 1, color: leftEndColor // 100% 处的颜色
            }]
          }
        }
      }
    ]
  }
}

/**
 * 雷达图配置
 */
class Radar {
  constructor ({
    indicator = [],
    zlevel = 2,
    radius = {
      inside: '20%',
      outside: '80%'
    },
    shape = 'circle',
    splitNumber = 5,
    splitArea = {
      show: false
    },
    axisLine = {
      show: true
    },
    splitLine = {
      show: true
    }
  }) {
    this.indicator = indicator
    this.zlevel = zlevel
    this.radius = radius
    this.shape = shape
    this.splitNumber = splitNumber
    this.splitArea = splitArea
    this.axisLine = new AxisLine(axisLine)
    this.splitLine = new SplitLine(splitLine)
  }

  /**
   * 获取雷达图配置
   * @returns {any}
   */
  getOption () {
    const { inside, outside } = this.radius
    return Object.assign(_.cloneDeep(this), {
      radius: [inside, outside]
    })
  }
}

/**
 * 坐标轴配置
 * @param aixsName = 坐标轴类型 'x' | 'y'
 * @param show 是否显示
 * @param position x轴位置 'bottom' | 'top'
 * @param type 坐标轴数据类型 'category' | 'value' | 'time'
 * @param boundaryGap 坐标轴留白 true | false | []
 * @param name 坐标轴名称 'category' | 'value' | 'time'
 * @param nameLocation 坐标轴名称位置 'end' | 'center' | 'start'
 * @param nameTextStyle 坐标轴名称样式
 * @param nameGap 坐标轴名称与轴线之间的距离 15
 * @param axisLine 坐标轴轴线相关设置
 * @param axisTick 坐标轴刻度相关设置
 * @param axisLabel 坐标轴刻度标签的相关设置
 * @param splitLine 坐标轴区域分隔线相关设置
 */
class Aixs {
  constructor ({
    aixsName = '',
    show = true,
    type = 'category',
    boundaryGap = true,
    showName = false,
    name = '',
    nameLocation = 'end',
    nameTextStyle = {},
    nameGap = 15,
    gridIndex = 1,
    axisLine = {},
    axisTick = {},
    axisLabel = {},
    splitLine = {}
  }) {
    this.show = show
    this.type = type
    this.boundaryGap = boundaryGap
    this.showName = showName
    this.name = name
    this.nameLocation = nameLocation
    this.nameTextStyle = new TextStyle(nameTextStyle)
    this.nameGap = nameGap
    this.gridIndex = gridIndex
    this.axisLine = new AxisLine(axisLine)
    this.axisTick = new AxisTick(axisTick)
    this.axisLabel = new AxisLabel(axisLabel)
    this.splitLine = new SplitLine(splitLine)
  }

  /**
   * 获取坐标轴配置
   * @returns {any}
   */
  getOption () {
    return Object.assign(_.cloneDeep(this), {
      name: this.showName ? this.name : ''
    })
  }
}

/**
 * x轴配置
 * 官方配置: https://echarts.apache.org/zh/option.html#xAxis
 */
class XAixs extends Aixs {
  constructor ({
    position = 'bottom',
    ...props
  }) {
    super(props)
    this.aixsName = 'x'
    this.position = position
  }
}

/**
 * y轴配置
 * 官方配置: https://echarts.apache.org/zh/option.html#yAxis
 */
class YAixs extends Aixs {
  constructor ({
    position = 'left',
    ...props
  }) {
    super(props)
    this.aixsName = 'y'
    this.position = position
  }
}

/**
 * 饼图基础配置
 * 官方配置： https://www.echartsjs.com/zh/option.html#pes-pie.type
 */
class SeriesPie {
  constructor ({
    id = 'SeriesPie',
    type = 'pie',
    radius = 80,
    center = ['50%', '50%'],
    z = 5,
    silent = true,
    labelLine = false,
    color = {
      start: 'red',
      end: 'orange',
      type: 'linear',
      colorStops: [{
        offset: 0,
        color: 'rgba(86,198,62,1)'
      }, {
        offset: 1,
        color: 'rgba(40,131,38,1)'
      }]
    },
    data = [100]
  }) {
    this.id = id
    this.type = type
    this.radius = radius
    this.center = center
    this.z = z
    this.silent = silent
    this.labelLine = labelLine
    this.color = color
    this.data = data
  }

  /**
   * 获取饼图配置
   */
  getOption () {
    let color
    if (this.color.type) {
      switch (this.color.type) {
        case '':
          // color = this.color
          break
        case 'linear':
          color = {
            type: 'linear',
            colorStops: [{
              offset: 0,
              color: this.color.start || 'rgba(86,198,62,1)'
            }, {
              offset: 1,
              color: this.color.end || 'rgba(40,131,38,1)'
            }]
          }
          break
        default:
          break
      }
    } else {
      color = this.color
    }
    return Object.assign(_.cloneDeep(this), {
      color
    })
  }
}
/*
 * 形状样式
 */
class Style {
  constructor ({
    colorMode = 'single',
    fill = 'rgba(64,169,255, 1)',
    stroke = 'rgba(12,142,255, 1)',
    lineWidth = 0
  }) {
    this.colorMode = colorMode
    this.fill = fill
    this.stroke = stroke
    this.lineWidth = lineWidth
  }

  /**
   * 映射配置
   * @returns {{} & Style & {fill: (string|{x: number, y: number, y2: number, x2: number, colorStops: [{offset: number, color}, {offset: number, color}], type: string})}}
   */
  getOption () {
    const fill = this.colorMode === 'single'
      ? this.fill
      : {
        type: 'linear',
        x: 1,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: this.fill.start || 'rgba(64,169,255, 1)'
          },
          {
            offset: 1,
            color: this.fill.end || 'rgba(0, 0, 0, 1)'
          }
        ]
      }
    return Object.assign({}, this, { fill })
  }
}

/**
 * echart图形
 * @param originType
 * 'container_center' 容器居中
 * 'container_topLeft' 容器左上
 * 'container_topRight' 容器右上
 * 'container_bottomRight' 容器右下
 * 'container_bottomLeft' 容器左下
 * 'graph_center' 图形居中
 * 'graph_topLeft' 图形左上
 * 'graph_topRight' 图形右上
 * 'graph_bottomRight' 图形右下
 * 'graph_bottomLeft' 图形左下
 */
class Graphic {
  constructor ({
    top = 0,
    left = 0,
    right = 0,
    bottom = 0,
    style = {}
  }) {
    this.top = top
    this.left = left
    this.right = right
    this.bottom = bottom
    this.style = new Style(style)
  }
}

/**
 * 矩形形状
 */
class RectShape {
  constructor ({
    width = 300,
    height = 300,
    borderTopLeftRadius = 0,
    borderTopRightRadius = 0,
    borderBottomRightRadius = 0,
    borderBottomLeftRadius = 0
  }) {
    this.width = width
    this.height = height
    this.borderTopLeftRadius = borderTopLeftRadius
    this.borderTopRightRadius = borderTopRightRadius
    this.borderBottomRightRadius = borderBottomRightRadius
    this.borderBottomLeftRadius = borderBottomLeftRadius
  }

  /**
   * 映射配置
   */
  getOption (chart, lineWidth, padding) {
    const { top, left, right, bottom } = padding
    const width = chart.getWidth() - lineWidth - left - right
    const height = chart.getHeight() - lineWidth - top - bottom

    return {
      width,
      height,
      r: [
        this.borderTopLeftRadius,
        this.borderTopRightRadius,
        this.borderBottomRightRadius,
        this.borderBottomLeftRadius
      ]
    }
  }
}

/**
 * 仪表盘基础配置
 */
class SeriesGauge {
  constructor (options = {
    id: 'SeriesGauge',
    type: 'gauge',
    radius: '100',
    min: 0,
    max: 100,
    startAngle: 225,
    endAngle: -134.8,
    z: 4,
    axisTick: {
      show: true,
      lineStyle: {
        width: 2,
        color: 'rgba(1,244,255, 0.9)'
      }
    },
    splitLine: {
      length: 16,
      lineStyle: {
        width: 2,
        color: 'rgba(1,244,255, 0.9)'
      }
    },
    axisLabel: {
      color: 'rgba(255,255,255,0)',
      fontSize: 12
    },
    pointer: {
      show: false
    },
    axisLine: {
      lineStyle: {
        opacity: 0
      }
    },
    detail: {
      show: false
    },
    data: [100]
  }) {
    Object.keys(options).forEach(key => {
      this[key] = options[key]
    })
  }
  /**
  * 获取仪表盘配置
  */
  getOption () {
    return Object.assign(_.cloneDeep(this))
  }
}
/**
 * 矩形
 */
class RectGraphic extends Graphic {
  constructor ({
    shape = {},
    ...graphicOption
  }) {
    super(graphicOption)
    this.type = 'rect'
    this.shape = new RectShape(shape)
  }

  /**
   * 映射配置
   * @param chart
   * @param padding
   * @returns {any}
   */
  getOption (chart, padding) {
    return Object.assign(_.cloneDeep(this),
      {
        shape: this.shape.getOption(chart, this.style.lineWidth, padding),
        style: this.style.getOption()
      },
      padding
    )
  }
}

/**
 * 园形形状
 */
class CircleShape {
  constructor ({
    cx = 0,
    cy = 0,
    r = 150
  }) {
    this.cx = cx
    this.cy = cy
    this.r = r
  }
}

/**
 * 圆形
 */
class CircleGraphic extends Graphic {
  constructor ({
    shape = {},
    ...graphicOption
  }) {
    super(graphicOption)
    this.type = 'circle'
    this.shape = new CircleShape(shape)
  }

  /**
   * 映射配置
   * @param chart
   * @param padding
   * @returns {any}
   */
  getOption (chart, padding) {
    const { top, left, right, bottom } = padding
    const width = chart.getWidth() - this.style.lineWidth - left - right
    const height = chart.getHeight() - this.style.lineWidth - top - bottom
    const r = Math.min(width, height) / 2
    const center = { x: width / 2 - r, y: height / 2 - r }
    return Object.assign(_.cloneDeep(this),
      {
        shape: new CircleShape({ r }),
        style: this.style.getOption(),
        top: center.y + top,
        left: center.x + left
      }
    )
  }
}

/**
 * 三角形形状
 */
class TriangleShape {
  constructor ({
    points = [],
    smooth = 0
  }) {
    this.points = points
    this.smooth = smooth
  }

  /**
   * 映射配置
   * @param chart
   * @param lineWidth
   * @param padding
   */
  getOption (chart, lineWidth, padding) {
    const { top, left, right, bottom } = padding
    const width = chart.getWidth() - lineWidth
    const height = chart.getHeight() - lineWidth - bottom
    const vertex = [width / 2, top]
    const leftPoint = [left, height]
    const rightPoint = [width - right, height]

    return {
      points: [vertex, leftPoint, rightPoint],
      smooth: this.smooth
    }
  }
}

/**
 * 三角形
 */
class TriangleGraphic extends Graphic {
  constructor ({
    shape = {},
    ...graphicOption
  }) {
    super(graphicOption)
    this.type = 'polygon'
    this.shape = new TriangleShape(shape)
  }

  /**
   * 映射配置
   * @param chart
   * @param padding
   * @returns {any}
   */
  getOption (chart, padding) {
    return Object.assign(_.cloneDeep(this),
      {
        shape: this.shape.getOption(chart, this.style.lineWidth, padding),
        style: this.style.getOption()
      },
      padding
    )
  }
}

/**
 * 图片样式
 */
class ImageStyle {
  constructor ({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    image = ''
  }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.image = image
  }
}

/**
 * 图片
 */
class ImageGraphic extends Graphic {
  constructor ({
    style = {},
    ...graphicOption
  }) {
    super(graphicOption)
    this.type = 'image'
    this.style = new ImageStyle(style)
  }

  /**
   * 映射配置
   * @param chart
   * @param padding
   * @returns {any}
   */
  getOption (chart, padding) {
    const { top, left, right, bottom } = padding
    const width = chart.getWidth() - left - right
    const height = chart.getHeight() - top - bottom
    const imageRatio = this.style.width / this.style.height
    const containerRatio = width / height
    const limit = imageRatio >= containerRatio
      ? { width, height: width / imageRatio }
      : { height, width: height * imageRatio }
    const center = { x: (width - limit.width) / 2, y: (height - limit.height) / 2 }

    return Object.assign(_.cloneDeep(this),
      {
        style: { image: this.style.image, ...limit },
        top: center.y + top,
        left: center.x + left
      }
    )
  }
}

/**
 * 告警列表 props 配置
 */
class AlarmListProps {
  constructor ({
    // 接口参数对象
    params = {},
    // 是否调用接口
    isCallInterface = false
  }) {
    this.params = params
    this.isCallInterface = isCallInterface
  }
}

/**
 * 列表 props 配置
 */
class ListProps {
  constructor ({
    styleConfig = {},
    // 接口参数对象
    params = {},
    // 是否调用接口
    isCallInterface = false
  }) {
    this.styleConfig = styleConfig
    this.params = params
    this.isCallInterface = isCallInterface
  }
}

export {
  AreaStyle,
  BarItemStyle,
  PieItemStyle,
  ItemStyle,
  Legend,
  LineStyle,
  Graphic,
  Title,
  XAixs,
  YAixs,
  TextStyle,
  SeriesPie,
  SeriesGauge,
  RectGraphic,
  CircleGraphic,
  TriangleGraphic,
  ImageGraphic,
  AlarmListProps,
  ListProps,
  PieLabel,
  AngleAxis,
  RadiusAxis,
  Polar,
  Radar,
  PolarLinearColors,
  PolarMask
}
