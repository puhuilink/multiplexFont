import { DynamicDataConfig } from './common/index'
import _ from 'lodash'

export default class TextHealthDynamicDataConfig extends DynamicDataConfig {
  getOption () {
    return this
      .fetch()
      .then(data => _.get(data, '0.data', ''))
  }
}
