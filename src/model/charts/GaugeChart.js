import Chart from './index'

/**
 * 仪表盘组件
 */
export default class GaugeChart extends Chart {
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
    const itemOptions = proprietaryConfig.getOption()
    dataConfig.dbDataConfig.getOption()
    const { sourceType } = dataConfig

    switch (sourceType) {
      case 'real': {
        try {
          itemOptions.series.data[0].value = await dataConfig.dbDataConfig.getOption()
        } catch (e) {
          itemOptions.series.data[0].value = 0
        }
      }
    }
    return {
      grid,
      ...itemOptions
    }
  }
}
