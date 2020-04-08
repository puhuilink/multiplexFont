import { getComponentValues } from '@/api/controller/View'

export default class GaugeDataConfig {
  constructor ({
    resourceConfig = {
      model: '',
      selectedInstance: [],
      selectedKpi: []
    },
    refreshTime = 0,
    // 外部 Ci 是否可用
    externalCi = true
  }) {
    this.resourceConfig = resourceConfig
    this.refreshTime = refreshTime
    this.externalCi = externalCi
  }

  /**
   * 与静态数据保持一致的数据结构
   * @returns {Promise<any>}
   */
  async getOption () {
    try {
      // 没有记录时返回长度为0的数组
      const [data] = await getComponentValues(this.resourceConfig)
      return {
        value: data ? data.value : 0
      }
    } catch (e) {
      return {
        value: 0
      }
    }
  }
}
