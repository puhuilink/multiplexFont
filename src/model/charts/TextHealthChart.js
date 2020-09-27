/**
* 文本健康度chart配置
*/
import Chart from './index'
import {
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC,
  SOURCE_TYPE_ALARM
} from '../config/dataConfig/dynamicData/types/sourceType'

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
      case SOURCE_TYPE_STATIC: {
        title.text = `${staticData}`
        break
      }
      case SOURCE_TYPE_NULL: {
        break
      }
      case SOURCE_TYPE_ALARM:
      case SOURCE_TYPE_REAL: {
        if (loadingDynamicData) {
          const dynamicData = await dataConfig.dbDataConfig.getOption(loadingDynamicData, sourceType)
          title.text = `${dynamicData}`
        }
        break
      }
    }

    title.textStyle.color = thresholdColorRule.calculateColor(title.text) || title.textStyle.color
    return { grid, title }
  }
}
