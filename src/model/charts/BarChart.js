/**
* 柱形图
* Author: dong xing
* Date: 2019/11/25
* Time: 4:59 下午
* Email: dong.xing@outlook.com
*/
import Chart from './index'
import _ from 'lodash'
import {
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC,
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_NUMBER, SOURCE_TYPE_STATIC_TRAFFIC, SOURCE_TYPE_CPE
} from '../config/dataConfig/dynamicData/types/sourceType'
import { autoTooltipPosition } from '@/utils/echarts'
import { formatFloat } from '@/utils/util'

export const reverseOption = ({ xAxis, yAxis, ...option }) => ({
  ..._.cloneDeep(option),
  xAxis: _.cloneDeep({
    ...xAxis,
    type: yAxis.type,
    data: yAxis.data
  }),
  yAxis: _.cloneDeep({
    ...yAxis,
    type: xAxis.type,
    data: xAxis.data
  })
})

export default class BarChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   * @param commonConfig
   * @param proprietaryConfig
   * @param dataConfig
   * @param {Boolean} loadingDynamicData 是否请求动态数据
   * @return {Promise<any>}
   */
  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const {
      barType, legend, barWidth, xAxis, yAxis,
      itemStyle: { color, ...otherItemStyle }
    } = proprietaryConfig.getOption()
    const { sourceType, staticDataConfig, dbDataConfig } = dataConfig
    console.log('show', legend.show)

    let series = []
    // 总体配置
    const option = { color, grid, legend, series, xAxis: [xAxis], yAxis: [yAxis] }

    const bar = {
      type: 'bar',
      // 剔除 color 对象，防止未格式化颜色影响图表颜色
      itemStyle: otherItemStyle
    }

    const { reverse, decimalPoint } = proprietaryConfig

    switch (sourceType) {
      case SOURCE_TYPE_STATIC: {
        dbDataConfig.resetData()
        const { series, ...rest } = staticDataConfig.getData(barType, reverse)
        const { legend: staticLegend, xAxis: staticXAxis, yAxis: staticYAxis } = rest
        Object.assign(option, {
          legend: Object.assign(legend, staticLegend),
          xAxis: Object.assign(xAxis, staticXAxis),
          yAxis: Object.assign(yAxis, staticYAxis),
          series: series.map(({ data = [], ...item }) => {
            return Object.assign(
              {}, item, bar,
              { barWidth, stack: barType === 'single' },
              {
                data: data.map((value) => decimalPoint === -1 ? value : formatFloat(value, decimalPoint))
              }
            )
          })
        })
        break
      }
      case SOURCE_TYPE_NULL: {
        dbDataConfig.resetData()
        break
      }
      case SOURCE_TYPE_NUMBER:
      case SOURCE_TYPE_COMBO:
      case SOURCE_TYPE_ALARM:
      case SOURCE_TYPE_STATIC_TRAFFIC:
      case SOURCE_TYPE_CPE:
      case SOURCE_TYPE_REAL: {
        // 根据数据流向，静态数据在进入 mappingOption 前已经完成 reverse
        // 而动态数据需要进入到 mappingOption 内部才能执行 reverse
        let dynamicData = await dbDataConfig.getOption(loadingDynamicData, sourceType)
        dynamicData = reverse ? reverseOption(dynamicData) : dynamicData
        series = dynamicData.series.map((item) => {
          if (decimalPoint !== -1) {
            if (Array.isArray(item.data)) {
              item.data = item.data.map(v => formatFloat(v, decimalPoint))
            } else if (typeof item.data === 'number') {
              item.data = formatFloat(item.data, decimalPoint)
            }
          }
          return {
            ...item,
            ...bar,
            barWidth,
            stack: barType === 'single',
            label: {
              show: true,
              distance: 60,
              formatter: function (params) {
                if (params.value > 0) {
                  return params.value
                } else {
                  return ''
                }
              }
            }
          }
        })

        const { legend: dynamicLegend, xAxis: dynamicXAxis, yAxis: dynamicYAxis, dataset } = dynamicData
        console.log('dy', dynamicLegend)
        if (dataset) {
          dataset.source = dataset.source.map((el) => {
            Object
              .entries(el)
              .forEach(([key, value]) => {
                if (typeof value === 'number' && decimalPoint !== -1) {
                  el[key] = formatFloat(value, decimalPoint)
                }
              })
            return el
          })
        }
        Object.assign(option, {
          dataset,
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
        position: autoTooltipPosition
      }
    })
  }
}
