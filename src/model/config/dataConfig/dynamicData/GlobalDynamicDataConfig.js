import { DynamicDataConfig } from '@/model/config/dataConfig/dynamicData/common'

class GlobalDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData, sourceType) {
    const dataList = await this.ormConfig.fetch()
    return dataList
  }
}

export { GlobalDynamicDataConfig }
