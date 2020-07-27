import { DynamicDataConfig } from './index'
import _ from 'lodash'

export default class TextHealthDataConfig extends DynamicDataConfig {
  async getOption () {
    return this.fetch({ limit: 1 })
      .then(({ data }) => _.get(data, '[0].value', 0))
      .catch(() => 'N/A')
      .then(value => value)
  }
}
