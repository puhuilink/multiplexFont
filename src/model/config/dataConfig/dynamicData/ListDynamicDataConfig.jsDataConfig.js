/**
 * 列表动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import { SOURCE_TYPE_REAL } from './types/sourceType'

export default class ListDynamicDataConfig extends DynamicDataConfig {
  /**
   * 与静态数据保持一致的数据结构
   * @returns {Promise<any>}
   */
  async getOption (loadingDynamicData, sourceType) {
    if (loadingDynamicData) {
      switch (sourceType) {
        case SOURCE_TYPE_REAL: {
          await this.getRealDataOption()
          break
        }
      }
    }
  }

  async getRealDataOption () {
    const dataList = await this.resourceConfig.fetch()
    console.log(dataList)
  }
}
