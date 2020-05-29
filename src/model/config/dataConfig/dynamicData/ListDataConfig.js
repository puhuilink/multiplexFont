import { KpiCurrentService } from '@/api-hasura'
import { DynamicDataConfig, TimeRange } from './index'

export default class ListDataConfig extends DynamicDataConfig {
  /**
   * 与静态数据保持一致的数据结构
   * @returns {Promise<any>}
   */
  async getOption () {
    try {
      // 没有记录时返回长度为0的数组
      // 引入配置时，timeRange 未经实例化，可以直接调用静态方法获取时间段
      const [data] = await KpiCurrentService.getValue(this.resourceConfig, TimeRange.getOption.apply(this.timeRange))
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
