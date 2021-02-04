import Chart from './index'
import {
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC
} from '../config/dataConfig/dynamicData/types/sourceType'

/**
 * 仪表盘组件
 */
export default class GaugeChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const itemOptions = proprietaryConfig.getOption()
    const { sourceType } = dataConfig

    // const [data] = itemOptions.series.data
    const [series] = itemOptions.series
    const [data] = series.data

    switch (sourceType) {
      case SOURCE_TYPE_STATIC: {
        const staticData = dataConfig.staticDataConfig.staticData
        Object.assign(data, staticData)
        break
      }
      case SOURCE_TYPE_COMBO:
      case SOURCE_TYPE_REAL: {
        const dynamicData = await dataConfig.dbDataConfig.getOption(loadingDynamicData, sourceType)
        Object.assign(data, dynamicData)
        break
      }
      case SOURCE_TYPE_NULL: {
        break
      }
    }
    return {
      grid,
      ...itemOptions
    }
  }
}
