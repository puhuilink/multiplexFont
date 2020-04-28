/**
* 文本健康度chart配置
*/
import Chart from './index'

export default class TextsChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   */
  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const { title } = proprietaryConfig.getOption()
    const { sourceType } = dataConfig

    switch (sourceType) {
      case 'static': {
        const staticData = dataConfig.staticDataConfig.staticData
        // Object.assign(data, staticData)
        title.text = staticData + ''
        break
      }
      case 'real': {
        if (loadingDynamicData) {
          const dynamicData = await dataConfig.dbDataConfig.getOption()
          // Object.assign(data, dynamicData)
          title.text = dynamicData + ''
          break
        }
      }
    }
    return { grid, title }
  }
}
