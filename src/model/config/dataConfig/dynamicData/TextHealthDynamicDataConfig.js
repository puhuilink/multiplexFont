/**
 * 文本健康度动态数据配置
 */

import { DynamicDataConfig } from './common/index'
import _ from 'lodash'
import {
  SOURCE_TYPE_REAL,
  SOURCE_TYPE_ALARM
} from './types/sourceType'

export default class TextHealthDynamicDataConfig extends DynamicDataConfig {
  async getOption (loadingDynamicData, sourceType) {
    if (loadingDynamicData) {
      switch (sourceType) {
        case SOURCE_TYPE_REAL: {
          await this.getRealDataOption()
          break
        }
        case SOURCE_TYPE_ALARM: {
          await this.getAlarmOption()
          break
        }
      }
    }
    return this.text
  }

  async getRealDataOption () {
    this.text = await this.resourceConfig.fetch().then(data => _.get(data, '0.data', ''))
  }

  async getAlarmOption () {
    const alarmList = await this.alarmConfig.fetch()
    const totalList = alarmList.map(({
      level1 = 0,
      level2 = 0,
      level3 = 0,
      level4 = 0,
      level5 = 0
    }) => level1 + level2 + level3 + level4 + level5)
    this.text = _.sum(totalList)
  }
}
