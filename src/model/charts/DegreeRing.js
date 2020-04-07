/*
 * 环度部件对象
 */

import Chart from './index'

export default class DegreeRing extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   */
  mappingOption ({ commonConfig, proprietaryConfig, dataConfig }) {
    const { grid } = commonConfig.getOption()
    const { innerCircle } = proprietaryConfig.getOption()
    console.log('innerCircle', innerCircle)
    return { grid, innerCircle }
  }
}
