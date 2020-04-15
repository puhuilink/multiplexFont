/**
 * 折线图
 * Author: dong xing
 * Date: 2019/11/20
 * Time: 8:55 上午
 * Email: dong.xing@outlook.com
 */

import Chart from './index'

export default class LineChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   * @param commonConfig 公共配置
   * @param proprietaryConfig 专有配置
   * @param dataConfig 数据配置
   * @param {Boolean} loadingDynamicData 是否请求动态数据
   * @return {Promise<any>}
   */
  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const { legend, xAxis, yAxis, ...options } = proprietaryConfig.getOption()
    const { sourceType, staticDataConfig: { staticData } } = dataConfig
    const line = {
      type: 'line',
      ...options
    }
    let series = []

    // 总体配置
    const option = { grid, legend, series, xAxis: [xAxis], yAxis: [yAxis] }

    switch (sourceType) {
      case 'static': {
        series = staticData.series.map((item) => {
          Object.assign(item, line)
          return item
        })
        const { legend: staticLegend, xAxis: staticXAxis, yAxis: staticYAxis } = staticData
        Object.assign(option, {
          legend: Object.assign(legend, staticLegend),
          xAxis: Object.assign(xAxis, staticXAxis),
          yAxis: Object.assign(yAxis, staticYAxis),
          series
        })
        break
      }
      case 'real': {
        if (loadingDynamicData) {
          const dynamicData = await dataConfig.dbDataConfig.getOption()
          // Object.assign(data, dynamicData)
          console.log('dynamicData', dynamicData)
          break
        }
      }
    }

    return option
  }
}
