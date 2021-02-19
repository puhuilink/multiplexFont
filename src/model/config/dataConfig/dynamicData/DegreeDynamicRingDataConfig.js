/**
 * 环度动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import _ from 'lodash'
import { SOURCE_TYPE_REAL, SOURCE_TYPE_COMBO } from './types/sourceType'

export default class DegreeRingDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData, sourceType) {
    let data = 0

    if (!loadingDynamicData) {
      return data
    }

    switch (sourceType) {
      case SOURCE_TYPE_REAL:
        data = await this.resourceConfig.fetch().then((data) => _.get(data, '[0].data', 0))
        break
      case SOURCE_TYPE_COMBO:
        data = await this.comboConfig.fetch().then((data) => _.get(data, '[0].data', 0))
        break
    }
    return data
  }
}
