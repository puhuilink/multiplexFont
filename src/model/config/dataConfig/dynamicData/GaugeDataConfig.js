import { DynamicDataConfig } from './index'
import _ from 'lodash'

export default class GaugeDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      return this.fetch({ limit: 1 })
        .then((data) => _.get(data, '[0].metric_value_str', '') || _.get(data, '[0].metric_value', 0))
        .catch(err => {
          console.error(err)
          return 0
        })
        .then(value => ({ value }))
    } else {
      return { value: 0 }
    }
  }
}
