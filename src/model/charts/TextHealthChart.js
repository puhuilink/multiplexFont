/**
* 文本健康度chart配置
*/
import Chart from './index'
import {
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC,
  SOURCE_TYPE_ALARM,
  SOURCE_TYPE_OVERVIEW,
  SOURCE_TYPE_COMBO
} from '../config/dataConfig/dynamicData/types/sourceType'
import { formatFloat } from '@/utils/util'

export default class TextsChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   */
  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const { title, thresholdColorRule, decimalPoint = 0 } = proprietaryConfig.getOption()
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
      case SOURCE_TYPE_OVERVIEW:
      case SOURCE_TYPE_COMBO:
      case SOURCE_TYPE_REAL: {
        const dynamicData = await dataConfig.dbDataConfig.getOption(loadingDynamicData, sourceType)
        // 无数据时使用缺省值
        if (!['', null, undefined].includes(dynamicData)) {
          title.text = `${dynamicData}`
        }
        break
      }
    }

    if (!isNaN(Number(title.text))) {
      title.text = formatFloat(title.text, decimalPoint)
    }

    title.textStyle.color = thresholdColorRule.calculateColor(title.text) || title.textStyle.color
    return { grid, title }
  }
}
