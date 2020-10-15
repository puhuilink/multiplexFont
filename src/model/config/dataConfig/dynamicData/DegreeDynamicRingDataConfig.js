/**
 * 环度动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import _ from 'lodash'

export default class DegreeRingDataConfig extends DynamicDataConfig {
  getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      return this.resourceConfig
        .fetch()
        .then((data) => _.get(data, '[0].data', 0))
    } else {
      return 0
    }
  }
}
