import Chart from './index'
import {
  SOURCE_TYPE_NULL,
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_STATIC
} from '../config/dataConfig/dynamicData/types/sourceType'

export default class PieChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const {
      legend, itemStyle: { color, ...otherItemStyle }, ...otherConfig
    } = proprietaryConfig.getOption()
    const { sourceType, staticDataConfig: { staticData }, dbDataConfig } = dataConfig
    let series = []

    // 总体配置
    const option = { color, grid, legend, series }

    const pie = {
      type: 'pie',
      itemStyle: otherItemStyle,
      ...otherConfig
    }

    switch (sourceType) {
      case SOURCE_TYPE_STATIC: {
        series = staticData.series.map((item) => {
          Object.assign(item, pie)
          return item
        })
        const { legend: staticLegend } = staticData
        Object.assign(option, {
          legend: Object.assign(legend, staticLegend),
          series
        })
        break
      }
      case SOURCE_TYPE_NULL: {
        dbDataConfig.resetData()
        break
      }
      case SOURCE_TYPE_REAL: {
        const { legend: dbLegend, series: dbSeries } = await dbDataConfig.getOption(loadingDynamicData)
        series = dbSeries.map((item) => {
          Object.assign(item, pie)
          return item
        })
        Object.assign(option, {
          legend: Object.assign(legend, dbLegend),
          series
        })
        break
      }
    }

    return option
  }
}
