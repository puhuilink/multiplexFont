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
  SOURCE_TYPE_ALARM
} from '../config/dataConfig/dynamicData/types/sourceType'
import { autoTooltipPosition } from '@/utils/echarts'

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

    let series = []
    // 总体配置
    const option = { color, grid, legend, series, xAxis: [xAxis], yAxis: [yAxis] }

    const bar = {
      type: 'bar',
      // 剔除 color 对象，防止未格式化颜色影响图表颜色
      itemStyle: otherItemStyle
    }

    const { reverse } = proprietaryConfig

    switch (sourceType) {
      case SOURCE_TYPE_STATIC: {
        dbDataConfig.resetData()
        const { series, ...rest } = staticDataConfig.getData(barType, reverse)
        const { legend: staticLegend, xAxis: staticXAxis, yAxis: staticYAxis } = rest
        Object.assign(option, {
          legend: Object.assign(legend, staticLegend),
          xAxis: Object.assign(xAxis, staticXAxis),
          yAxis: Object.assign(yAxis, staticYAxis),
          series: series.map((item) => {
            return Object.assign(
              {}, item, bar,
              { barWidth, stack: barType === 'single' }
            )
          })
        })
        break
      }
      case SOURCE_TYPE_NULL: {
        dbDataConfig.resetData()
        break
      }
      case SOURCE_TYPE_ALARM:
      case SOURCE_TYPE_REAL: {
        // 根据数据流向，静态数据在进入 mappingOption 前已经完成 reverse
        // 而动态数据需要进入到 mappingOption 内部才能执行 reverse
        let dynamicData = await dbDataConfig.getOption(loadingDynamicData, sourceType)
        dynamicData = reverse ? reverseOption(dynamicData) : dynamicData
        series = dynamicData.series.map((item) => {
          return {
            ...item,
            ...bar,
            barWidth,
            stack: barType === 'single'
          }
        })
        const { legend: dynamicLegend, xAxis: dynamicXAxis, yAxis: dynamicYAxis, dataset } = dynamicData
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
