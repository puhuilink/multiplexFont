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
    const { title, thresholdColorRule } = proprietaryConfig.getOption()
    const { sourceType, staticDataConfig: { staticData } } = dataConfig

    switch (sourceType) {
      case 'static': {
        title.text = `${staticData}`
        break
      }
      case 'real': {
        if (loadingDynamicData) {
          const dynamicData = await dataConfig.dbDataConfig.getOption()
          title.text = `${dynamicData}`
          break
        }
      }
    }

    title.textStyle.color = thresholdColorRule.calculateColor(title.text) || title.textStyle.color
    return { grid, title }
  }
}
