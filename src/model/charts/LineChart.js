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
    const { sourceType, staticDataConfig: { staticData }, dbDataConfig } = dataConfig
    const line = {
      type: 'line',
      ...options
    }
    let series = []

    // 总体配置
    const option = { grid, legend, series, xAxis: [xAxis], yAxis: [yAxis] }

    switch (sourceType) {
      case 'static': {
        dbDataConfig.resetData()
        series = staticData.series.map((item) => ({ ...item, ...line }))
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
        const dynamicData = await dbDataConfig.getOption(loadingDynamicData)
        series = dynamicData.series.map((item) => ({ ...item, ...line }))
        const { legend: dynamicLegend, xAxis: dynamicXAxis, yAxis: dynamicYAxis } = dynamicData
        Object.assign(option, {
          legend: Object.assign(legend, dynamicLegend),
          xAxis: Object.assign(xAxis, dynamicXAxis),
          yAxis: Object.assign(yAxis, dynamicYAxis),
          series
        })
        break
      }
    }

    return Object.assign({}, option, {
      tooltip: {
        trigger: 'axis'
        // formatter: function (params) {
        //   // params = params[0];
        //   // var date = new Date(params.name);
        //   // return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
        //   return 'test'
        // },
        // axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //   type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        // }
      }
    })
  }
}
