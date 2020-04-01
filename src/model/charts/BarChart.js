/**
* 柱形图
* Author: dong xing
* Date: 2019/11/25
* Time: 4:59 下午
* Email: dong.xing@outlook.com
*/
import Chart from './index'

export default class BarChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   * @param {Boolean} loadingDynamicData 是否请求动态数据
   * @return {Promise<any>}
   */
  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const {
      barType, legend, barWidth, xAxis, yAxis,
      itemStyle: { color, ...otherItemStyle }
    } = proprietaryConfig.getOption()
    const { sourceType, staticData, dbDataConfig } = dataConfig
    let series = []

    // 总体配置
    const option = { color, grid, legend, series, xAxis: [xAxis], yAxis: [yAxis] }

    const bar = {
      type: 'bar',
      // 剔除 color 对象，防止未格式化颜色影响图表颜色
      itemStyle: otherItemStyle
    }

    switch (sourceType) {
      case 'static': {
        series = staticData[barType === 'single' ? 'singleSeries' : 'multipleSeries'].map((item) => {
          Object.assign(item, bar, { barWidth })
          return item
        })
        console.log('series', series)
        const { legend: staticLegend, xAxis: staticXAxis, yAxis: staticYAxis } = staticData
        Object.assign(option, {
          legend: Object.assign(legend, staticLegend),
          xAxis: Object.assign(xAxis, staticXAxis),
          yAxis: Object.assign(yAxis, staticYAxis),
          series
        })
        break
      }
      case 'null': {
        break
      }
      case 'real': {
        if (loadingDynamicData) {
          try {
            const dynamicData = await dbDataConfig.getOption()
            series = dynamicData.singleSeries.map((item) => {
              Object.assign(item, bar, { barWidth })
              return item
            })
            const { legend: dynamicLegend, xAxis: dynamicXAxis, yAxis: dynamicYAxis } = dynamicData
            Object.assign(option, {
              legend: Object.assign(legend, dynamicLegend),
              xAxis: Object.assign(xAxis, dynamicXAxis),
              yAxis: Object.assign(yAxis, dynamicYAxis),
              series
            })
          } catch (e) {
            // TODO: reset，或者放到 dbDataConfig 中返回空
            throw e
          }
        } else {
          Object.assign(option, this.lastOption)
        }
        break
      }
    }
    this.lastOption = Object.assign({}, option)
    return Object.assign({}, option)
  }
}
