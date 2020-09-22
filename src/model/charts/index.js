/**
 * echarts 图表对象
 * Author: dong xing
 * Date: 2019/11/25
 * Time: 4:55 下午
 * Email: dong.xing@outlook.com
 */
import anime from 'animejs'
import echarts from 'echarts'
import _ from 'lodash'

export default class Chart {
  constructor ({ widget }) {
    this.container = document.getElementById(widget.widgetId)
    this.chartConfig = {}
    this.setContainer(widget)
    this.init(widget)
    this.setStyle(widget.config)
    this.config = widget.config
  }

  /**
   * 初始设置图表位置尺寸
   * @param config
   */
  setContainer ({ config }) {
    const {
      width, height, top, left, zIndex
    } = config.commonConfig
    anime.set(this.container, {
      width,
      height,
      top,
      left,
      zIndex
    })
  }

  /**
   * 设置基本样式
   * @param config
   */
  setStyle (config) {
    const {
      colorMode, backgroundColor, border
    } = config.commonConfig
    anime.set(this.container, {
      ...border.getOption(),
      background: colorMode === 'single'
        ? backgroundColor
        : `linear-gradient(${backgroundColor.angle}deg, ${backgroundColor.start}, ${backgroundColor.end})`
    })
    // 在矩形等图形中，设置resize调用矩形类的resize方法，需要传入config配置
    this.resize(config)
  }

  /**
   * 初始化图表
   * @param widget
   */
  init ({ config }) {
    this.chart = echarts.init(this.container, '', {
      renderer: 'canvas'
    })
    this.mergeOption(config)
  }

  /**
   * 图表resize
   */
  resize () {
    this.chart.resize()
  }

  /**
   * 重置图表默认配置
   */
  reset () {
    this.chart.setOption({})
  }

  /**
   * 完整配置设置
   * @param config
   */
  setConfig (config) {
    this.setStyle(config)
    this.mergeOption(config)
  }

  /**
   * 映射成 echarts 配置项
   */
  // eslint-disable-next-line class-methods-use-this
  mappingOption () {}

  /**
   * 设置新的配置项渲染图表
   * @param config widget 配置项
   * @param {Boolean} loadingDynamicData 是否同时绘制动态数据
   */
  async mergeOption (config, loadingDynamicData = false) {
    // 向外暴露 echarts 配置
    this.chartConfig = await this.mappingOption(config, loadingDynamicData)
    // 如果数据为空则清空图表
    if (_.isEmpty(this.chartConfig.series)) {
      this.chart.clear()
    }
    // 重新配置图表
    this.chart.setOption(this.chartConfig)

    // console.log(
    //   _.cloneDeep(this.chartConfig)
    // )

    // 供测试人员调试数据
    // FIXME: 生产环境关闭
    const { container: { id }, chartConfig: { series } } = this
    window[id] = _.cloneDeep(series)
  }

  refresh () {
    this.mergeOption(this.config, true)
  }

  /**
   * 轮询
   */
  intervalRefresh () {
    this.refresh()
    // 存在自动刷新时间设置则开启定时刷新
    const refreshTime = _.get(this, 'config.dataConfig.dbDataConfig.refreshTime')
    if (refreshTime > 0) {
      // console.log('timer启动')
      this.timer = setInterval(() => this.refresh(), Number(refreshTime) * 1000 * 60
      )
    }
  }

  restartIntervalRefresh () {
    this.resetTimer()
    this.intervalRefresh()
  }

  resetTimer () {
    clearInterval(this.timer)
    this.timer = null
  }

  /**
   * 销毁事件
   */
  destroy () {
    this.resetTimer()
    // 供测试人员调试数据
    // FIXME: 生产环境关闭
    const { container: { id } } = this
    window[id] = undefined
  }
}
