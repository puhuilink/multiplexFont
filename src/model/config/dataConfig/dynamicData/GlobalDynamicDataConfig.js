import { DynamicDataConfig } from '@/model/config/dataConfig/dynamicData/common'

class GlobalDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData, sourceType) {
    console.log('beforeFetch', sourceType)
    const dataList = await this.ormConfig.fetch()
    console.log('fetch', dataList)
    return dataList
  }
}

export { GlobalDynamicDataConfig }
