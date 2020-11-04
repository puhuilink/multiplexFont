import { ALL_SEND_TYPE_MAPPING, SEND_TYPE_MAPPING } from '@/composables/alarm-temp/types'
import _ from 'lodash'
import { TEMP_TYPE } from '@/api-hasura/dao/types/AlarmTemp'

export {
  ALL_SEND_TYPE_MAPPING,
  SEND_TYPE_MAPPING
}

export class AlarmTempModel {
  static fields = ['id', 'mode', 'message', 'enabled', 'title', 'type']

  static serialize ({ enabled, ...alarmTemp }) {
    return _.pick({
      enabled: !!enabled,
      type: TEMP_TYPE.alarm,
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
