import _ from 'lodash'
import { TEMP_TYPE } from '@/tables/alarm_temp/enum'
import { ALL_SEND_TYPE_MAPPING, SEND_TYPE_MAPPING } from '@/tables/alarm_temp/types'

export {
  ALL_SEND_TYPE_MAPPING,
  SEND_TYPE_MAPPING
}

export class PatrolModel {
  static fields = ['id', 'mode', 'message', 'enabled', 'title', 'type', 'subject']

  static serialize ({ enabled, ...patrolTemp }) {
    return _.pick({
      enabled: !!enabled,
      type: TEMP_TYPE.alarm,
      ...patrolTemp
    }, this.fields)
  }

  static deSerialize ({ enabled, ...patrolTemp }) {
    return _.pick({
      enabled: ~~enabled,
      ...patrolTemp
    }, this.fields)
  }
}
