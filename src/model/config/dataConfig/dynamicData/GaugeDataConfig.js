import { getComponentValues } from '@/api/controller/View'

export default class GaugeDataConfig {
  constructor ({
    resourceConfig = {
      model: '',
      selectedInstance: [],
      selectedKpi: []
    }
  }) {
    this.resourceConfig = resourceConfig
  }

  /**
   * 与静态数据保持一致的数据结构
   * @returns {Promise<any>}
   */
  async getOption () {
    try {
      // 没有记录时返回长度为0的数组
      const [data] = await getComponentValues(this.resourceConfig)
      return data ? data.value : 0
    } catch (e) {
      return 0
    }
  }
}
