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
   */
  mappingOption ({ commonConfig, proprietaryConfig, dataConfig }) {
    const { grid } = commonConfig.getOption()
    const itemOptions = proprietaryConfig.getOption()
    return {
      grid,
      ...itemOptions,
      // TODO
      ...dataConfig.dbDataConfig.getOption()
    }
  }
}
