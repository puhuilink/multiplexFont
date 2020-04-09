/*
 * 环度部件对象
 */

import Chart from './index'
// import echartsLiquidfill from 'echarts-liquidfill'

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
    const { series } = proprietaryConfig.getOption()
    const { sourceType } = dataConfig

    const [data] = series.data
    switch (sourceType) {
      case 'static': {
        const staticData = dataConfig.staticDataConfig.staticData
        Object.assign(data, staticData)
        break
      }
      case 'real': {
        if (loadingDynamicData) {
          const dynamicData = await dataConfig.dbDataConfig.getOption()
          Object.assign(data, dynamicData)
          break
        }
      }
    }
    return { grid, series }
  }
}
