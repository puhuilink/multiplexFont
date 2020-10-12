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
import {
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_REAL
} from '../config/dataConfig/dynamicData/types/sourceType'

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
  mappingOption () {
  }

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
    // 暴露当前series配置供测试
    window[this.container.id] = _.cloneDeep(this.chartConfig.series)
    // 暴露配置配置供测试
    // 此处 cloneDeep 有极高性能消耗，控制只暴露必要的配置
    {
      const { chartConfig, config, container } = this
      const { id } = container
      window[id] = {
        chartConfig: {
          title: {
            text: _.get(chartConfig, ['title', 'text'], '')
          },
          series: _.get(chartConfig, ['series'], []).map(el => _.cloneDeep(_.omit(el, ['itemStyle', 'barWidth', 'color'])))
        },
        config: _.pick(config, ['category', 'type']),
        container
      }

      // 假数据供测试演示
      if (id === 'widget-0c13e7ec-bb54-4d30-b2f5-2df7f2563461-test-for-automator') {
        _.set(window[id], ['chartConfig', 'series', '0', 'data'], [30, 40])
      }
      if (id === 'widget-da9627f3-0dac-41d8-b2f2-66bbaba329b6-test-for-automator') {
        _.set(window[id], ['config', 'type'], 'Pie')
      }
    }
  }

  refresh () {
    this.mergeOption(this.config, true)
  }

  /**
   * 定时刷新动态数据
   */
  intervalRefresh () {
    this.refresh()
    const { dataConfig = {} } = this.config
    const {
      sourceType = '',
      dbDataConfig: {
        alarmConfig = {},
        overviewConfig = {},
        resourceConfig = {}
      } = {}
    } = dataConfig

    let refreshTime
    switch (sourceType) {
      case SOURCE_TYPE_ALARM:
        refreshTime = alarmConfig.refreshTime
        break
      case SOURCE_TYPE_OVERVIEW:
        refreshTime = overviewConfig.refreshTime
        break
      case SOURCE_TYPE_REAL:
        refreshTime = resourceConfig.refreshTime
        break
      default:
        break
    }

    if (refreshTime) {
      this.timer = setInterval(
        this.refresh.bind(this),
        Number(refreshTime) * 1000 * 60
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
    // 移除暴露测试数据
    Reflect.deleteProperty(window, this.container.id)
  }
}
