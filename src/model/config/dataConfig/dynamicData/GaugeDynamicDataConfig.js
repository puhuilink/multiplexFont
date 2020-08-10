import { DynamicDataConfig } from './common/index'
import _ from 'lodash'

export default class GaugeDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      return this.fetch({ limit: 1 })
        .then((data) => _.get(data, '[0].value', ''))
        .then(value => ({ value }))
    } else {
      return { value: 0 }
    }
  }
}
