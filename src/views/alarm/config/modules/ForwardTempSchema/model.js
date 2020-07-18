import { ALL_SEND_TYPE_MAPPING } from '../../../config/typing'
import _ from 'lodash'

export {
  ALL_SEND_TYPE_MAPPING
}

export class AlarmTempModel {
  static fields = ['id', 'mode', 'message', 'enabled', 'title']

  static serialize ({ enabled, ...alarmTemp }) {
    return _.pick({
      enabled: !!enabled,
      ...alarmTemp
    }, this.fields)
  }

  static deSerialize ({ enabled, ...alarmTemp }) {
    return _.pick({
      enabled: ~~enabled,
      ...alarmTemp
    }, this.fields)
  }
}
