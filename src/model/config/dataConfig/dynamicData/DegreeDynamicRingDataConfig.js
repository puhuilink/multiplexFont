import { DynamicDataConfig } from './common/index'
import _ from 'lodash'

export default class DegreeRingDataConfig extends DynamicDataConfig {
  getOption (loadingDynamicData) {
    if (loadingDynamicData) {
      return this
        .fetch({ limit: 1 })
        .then((data) => _.get(data, '[0].value', 0))
    } else {
      return 0
    }
  }
}