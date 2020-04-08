/*
 * 健康度
 */
import Chart from './index'

export default class HealthDegreeChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   */
  mappingOption ({ commonConfig, proprietaryConfig, dataConfig }) {
    const { grid } = commonConfig.getOption()
    const { title, series } = proprietaryConfig.getOption()
    const [inside, outside] = series
    return { grid, title, series: [inside, outside] }
  }
}
