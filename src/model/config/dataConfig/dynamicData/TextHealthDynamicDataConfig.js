import { DynamicDataConfig } from './common/index'
import _ from 'lodash'

export default class TextHealthDynamicDataConfig extends DynamicDataConfig {
  getOption () {
    return this
      .fetch()
      .then(data => _.get(data, '0.data', ''))
  }

  async getAlarmOption () {
    const [data = {}] = await this.alarmConfig.fetch()
    const {
      level1 = 0,
      level2 = 0,
      level3 = 0,
      level4 = 0,
      level5 = 0
    } = data
    return level1 + level2 + level3 + level4 + level5
  }
}
