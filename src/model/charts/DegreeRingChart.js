/*
 * 环度部件对象
 */

import Chart from './index'

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
    const { series, decimalPoint = 0 } = proprietaryConfig.getOption()
    const { sourceType } = dataConfig

    // const [data] = series.data
    switch (sourceType) {
      case 'static': {
        const staticData = dataConfig.staticDataConfig.staticData
        // Object.assign(data, staticData)
        series.label.formatter = staticData + ''
        break
      }
      case 'real': {
        if (loadingDynamicData) {
          const dynamicData = await dataConfig.dbDataConfig.getOption()
          series.label.formatter = dynamicData + ''
          break
        }
      }
    }

    // 原始值
    const { label: { formatter } } = series
    // 处理小数点后的值
    series.label.formatter = formatFloat(Number(formatter), decimalPoint)

    return { grid, series }
  }
}
