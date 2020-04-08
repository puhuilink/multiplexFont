/*
 * 环度部件对象
 */

import Chart from './index'
// import echartsLiquidfill from 'echarts-liquidfill'

export default class DegreeRingChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   */
  mappingOption ({ commonConfig, proprietaryConfig, dataConfig }) {
    const { grid } = commonConfig.getOption()
    const { series } = proprietaryConfig.getOption()
    return { grid, series }
  }
}
