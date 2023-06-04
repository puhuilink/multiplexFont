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
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_DH,
  SOURCE_TYPE_SQL,
  SOURCE_TYPE_STATIC_TRAFFIC
  , SOURCE_TYPE_OPEN, SOURCE_TYPE_PLUS
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
    const { grid, backgroundColor } = commonConfig.getOption()
    const { title, type, thresholdColorRule, decimalPoint = 0 } = proprietaryConfig.getOption()
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
      case SOURCE_TYPE_DH:
      case SOURCE_TYPE_SQL:
      case SOURCE_TYPE_STATIC_TRAFFIC:
      case SOURCE_TYPE_REAL: {
        const dynamicData = await dataConfig.dbDataConfig.getOption(loadingDynamicData, sourceType)
        // 无数据时使用缺省值
        if (!['', null, undefined].includes(dynamicData)) {
          title.text = `${dynamicData}`
        }
        break
      }
      case SOURCE_TYPE_OPEN: {
        const dynamicData = await dataConfig.dbDataConfig.getOption(loadingDynamicData, sourceType)
        // 无数据时使用缺省值
        if (!['', null, undefined].includes(dynamicData)) {
          title.text = `${dynamicData}`
        }
        break
      }
      case SOURCE_TYPE_PLUS: {
        const dynamicData = await dataConfig.dbDataConfig.getOption(loadingDynamicData, sourceType)
        // 无数据时使用缺省值
        if (!['', null, undefined].includes(dynamicData)) {
          title.text = `${dynamicData}`
        }
        break
      }
    }
    // const textCopy = _.cloneDeep(title)
    if (!isNaN(Number(title.text))) {
      title.text = decimalPoint === -1 ? title.text : formatFloat(Number(title.text), decimalPoint)
    }
    const colors = thresholdColorRule.calculateColor(title.text)
    if (colors) {
      const { thresBgColor, thresholdColor } = colors
      title.textStyle.color = thresholdColor || title.textStyle.color
      backgroundColor.backgroundColor = thresBgColor || backgroundColor
    }
    const tooltip = {
      show: true,
      trigger: 'item',
      formatter: (parms) => {
        return title.text
      }
    }
    title.text = this.formatText(type, title.text)
    console.log('textHealth', title.text, { grid, title, ...backgroundColor })
    return { grid, title, tooltip, ...backgroundColor }
  }
  formatText (type = 'default', originText = '') {
    switch (type) {
      case 'quote':
        return '"' + originText + '"'
      case 'parenthesis':
        return '(' + originText + ')'
      case 'curly':
        return '{' + originText + '}'
      case 'bracket':
        return '[' + originText + ']'
      default:
        return originText
    }
  }
}
