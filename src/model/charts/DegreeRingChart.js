/*
 * 环度部件对象
 */

import Chart from './index'
import { DEGREE_TYPE_HEALTH_DEGREE, DEGREE_TYPE_HEALTH_RING } from '../config/proprietaryConfigs/DegreeRingProprietaryConfig'

const formatFloat = function (value, n) {
  var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
  var s = f.toString()
  var rs = s.indexOf('.')
  if (rs < 0 && n > 0) {
    s += '.'
  }
  for (var i = s.length - s.indexOf('.'); i <= n; i++) {
    s += '0'
  }
  return s
}

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
      case 'static': {
        formatter = `${staticData}`
        break
      }
      case 'real': {
        const dynamicData = await dataConfig.dbDataConfig.getOption(loadingDynamicData)
        formatter = `${dynamicData}`
        break
      }
      case 'null': {
        formatter = '0'
        break
      }
    }

    // 处理小数点后的值
    series.label.formatter = formatFloat(Number(formatter), decimalPoint)

    const insideColor = thresholdColorRule.calculateColor(series.label.formatter) || series.label.insideColor
    Object.assign(series.label, { insideColor })

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
