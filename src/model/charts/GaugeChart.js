import Chart from './index'

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
      case 'static': {
        const staticData = dataConfig.staticDataConfig.staticData
        Object.assign(data, staticData)
        break
      }
      case 'real': {
        // TODO: old values
        if (loadingDynamicData) {
          const dynamicData = await dataConfig.dbDataConfig.getOption()
          Object.assign(data, dynamicData)
          break
        }
      }
    }
    return {
      grid,
      ...itemOptions
    }
  }
}
