import Chart from './index'

export default class PieChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const {
      legend, itemStyle: { color, ...otherItemStyle }, ...otherConfig
    } = proprietaryConfig.getOption()
    const { sourceType, staticDataConfig: { staticData } } = dataConfig
    let series = []

    // 总体配置
    const option = { color, grid, legend, series }

    const pie = {
      type: 'pie',
      itemStyle: otherItemStyle,
      ...otherConfig
    }

    switch (sourceType) {
      case 'static': {
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
      case 'real': {
        if (loadingDynamicData) {
          await dataConfig.dbDataConfig.getOption()
        }
        break
      }
    }

    return option
  }
}
