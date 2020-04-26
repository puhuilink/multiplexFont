/**
* 文本健康度chart配置
*/
import Chart from './index'

export default class TextsChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   */
  mappingOption ({ commonConfig, proprietaryConfig, dataConfig }) {
    const { grid } = commonConfig.getOption()
    const itemOptions = proprietaryConfig.getOption()
    return { grid, ...itemOptions }
  }
}
