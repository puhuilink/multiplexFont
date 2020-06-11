import { DynamicDataConfig } from './index'

export default class ListDataConfig extends DynamicDataConfig {
  /**
   * 与静态数据保持一致的数据结构
   * @returns {Promise<any>}
   */
  async getOption () {
    try {
      const [data] = await this.fetch()
      return data ? data.value : {
        columns: [],
        ListData: []
      }
    } catch (e) {
      console.log(e)
      return {
        columns: [],
        ListData: []
      }
    }
  }
}
