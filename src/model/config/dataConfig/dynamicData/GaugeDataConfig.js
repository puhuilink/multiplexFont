import { getComponentValues } from '@/api/controller/View'

export default class GaugeDataConfig {
  constructor ({ model, selectedInstance, selectedKpi }) {
    this.model = model
    this.selectedInstance = selectedInstance
    this.selectedKpi = selectedKpi
  }

  /**
   * 与静态数据保持一致的数据结构
   * @returns {Promise<any>}
   */
  async getOption () {
    const { model, selectedInstance, selectedKpi } = this
    return getComponentValues({ model, selectedInstance, selectedKpi })
      .then(([data]) => data ? data.value : 0)
  }
}
