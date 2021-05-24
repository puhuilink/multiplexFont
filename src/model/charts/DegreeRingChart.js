/*
 * 环度部件对象
 */

import Chart from './index'
import { DEGREE_TYPE_HEALTH_DEGREE, DEGREE_TYPE_HEALTH_RING } from '../config/proprietaryConfigs/DegreeRingProprietaryConfig'
import {
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC
} from '../config/dataConfig/dynamicData/types/sourceType'
import { formatFloat } from '@/utils/util'
export default class DegreeRingChart extends Chart {
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
    const { series, decimalPoint = 0, thresholdColorRule, type } = proprietaryConfig.getOption()
    const { sourceType, staticDataConfig: { staticData } } = dataConfig
    let formatter

    switch (sourceType) {
      case SOURCE_TYPE_STATIC: {
        formatter = `${staticData}`
        break
      }
      case SOURCE_TYPE_COMBO:
      case SOURCE_TYPE_REAL: {
        const dynamicData = await dataConfig.dbDataConfig.getOption(loadingDynamicData, sourceType)
        // console.log(dynamicData)
        formatter = `${dynamicData}`
        break
      }
      case SOURCE_TYPE_NULL: {
        formatter = '0'
        break
      }
    }

    // 处理小数点后的值
    series.label.formatter = decimalPoint === -1 ? Number(formatter) : formatFloat(Number(formatter), decimalPoint)
    const colors = thresholdColorRule.calculateColor(series.label.formatter)
    if (colors) {
      const { thresholdColor, thresBgColor, thresInlineColor } = colors
      series.label.insideColor = thresholdColor
      // grid[1].backgroundColor = thresBgColor || grid[1].backgroundColor
      // 外环颜色
      series.backgroundStyle.borderColor = thresBgColor || series.backgroundStyle.borderColor
      series.backgroundStyle.color = thresInlineColor || series.backgroundStyle.color
    } else {
      Object.assign(series.label, series.label.insideColor)
      series.label.insideColor = '#fff'
      series.backgroundStyle.borderColor = '#195ba6'
      series.backgroundStyle.color = '#195ba6'
    }
    // const insideColor = thresholdColorRule.calculateColor(series.label.formatter) || series.label.insideColor

    switch (type) {
      case DEGREE_TYPE_HEALTH_RING: {
        break
      }
      case DEGREE_TYPE_HEALTH_DEGREE: {
        series.backgroundStyle.borderWidth = 0
        break
      }
    }

    return { grid, series }
  }
}
