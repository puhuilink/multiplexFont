/**
 * 仪表盘动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import _ from 'lodash'
import {
  SOURCE_TYPE_COMBO,
  SOURCE_TYPE_REAL
} from './types/sourceType'
export default class GaugeDynamicDataConfig extends DynamicDataConfig {
  getOption (loadingDynamicData, sourceType) {
    let config

    switch (sourceType) {
      case SOURCE_TYPE_COMBO:
        config = this.comboConfig
        break
      case SOURCE_TYPE_REAL:
        config = this.resourceConfig
        break
      default:
        throw new Error(`Unknown sourceType: ${sourceType}`)
    }

    if (loadingDynamicData) {
      return config
        .fetch()
        .then(data => _.get(data, '[0].data', 0))
        .then(value => ({ value }))
    } else {
      return { value: 0 }
    }
  }
}
