import { DynamicDataConfig } from './common/index'
import _ from 'lodash'

export default class GaugeDynamicDataConfig extends DynamicDataConfig {
  getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      return this
        .fetch()
        .then((data) => _.get(data, '[0].data', ''))
        .then(value => ({ value }))
    } else {
      return { value: 0 }
    }
  }
}
