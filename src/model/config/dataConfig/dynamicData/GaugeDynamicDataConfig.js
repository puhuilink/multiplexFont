/**
 * 仪表盘动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import _ from 'lodash'

export default class GaugeDynamicDataConfig extends DynamicDataConfig {
  getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      return this.resourceConfig
        .fetch()
        .then(data => _.get(data, '[0].data', 0))
        .then(value => ({ value }))
    } else {
      return { value: 0 }
    }
  }
}
