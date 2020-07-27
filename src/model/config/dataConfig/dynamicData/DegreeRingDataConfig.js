import { DynamicDataConfig } from './index'
import _ from 'lodash'

export default class DegreeRingDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      return this.fetch({ limit: 1 })
        .then(({ data }) => _.get(data, '[0].value', 0))
        .catch(() => 0)
        .then(value => ({ value }))
    } else {
      return 0
    }
  }
}
