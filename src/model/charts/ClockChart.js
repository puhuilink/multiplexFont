import Chart from './index'
import _ from 'lodash'
import moment from 'moment'

/**
 * 时钟组件
 */
export default class ClockChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
    this.startTimer()
  }

  startTimer () {
    this.timer = setInterval(() => {
      // 此处绕过 vuex 直接从底层调整 chart，会导致修改的部分不会经过 vue 的响应式更新
      // 但时间组件的内容不需要经由 vue 处理，其他地方不受影响
      this.chartConfig.title.text = moment().format(this.chartConfig.format || 'YYYY-MM-DD HH:mm:ss')
      this.chart.setOption(this.chartConfig)
    }, 1000)
  }

  endTimer () {
    clearInterval(this.timer)
    this.timer = null
  }

  /**
   * 映射成 echarts 配置项
   */
  mappingOption ({ commonConfig, proprietaryConfig, dataConfig }) {
    const { grid } = commonConfig.getOption()
    const itemOptions = proprietaryConfig.getOption()
    return { grid, ...itemOptions }
  }

  /**
   *  * 设置新的配置项渲染图表
   * @param config widget 配置项
   */
  mergeOption (config) {
    // 向外暴露 echarts 配置
    this.chartConfig = this.mappingOption(config)
    this.chartConfig.title.text = moment().format(this.chartConfig.format || 'YYYY-MM-DD HH:mm:ss')
    // 如果数据为空则清空图表
    if (_.isEmpty(this.chartConfig.series)) {
      this.chart.clear()
    }
    // 重新配置图表
    this.chart.setOption(this.chartConfig)
    // this.endTimer()
    // this.startTimer()
  }

  destroy () {
    this.endTimer()
  }
}
