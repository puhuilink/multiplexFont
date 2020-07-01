import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
import { XjChangeShiftDao } from '../dao'
import _ from 'lodash'

class PatrolService extends BaseService {
  static async changeShiftFind (argus = {}) {
    return query(
      XjChangeShiftDao.find(argus)
    )
  }

  static async changeShiftDetail (id) {
    const { data: { changeShiftList } } = await this.changeShiftFind({
      where: { id },
      alias: 'changeShiftList',
      fields: [
        'hand_name',
        'hand_time',
        'tool',
        'data',
        'monitor_status',
        'temperature',
        'humidity',
        'sanitary',
        'alarm_info',
        'fault_conditions',
        'other',
        'other_matter',
        'receive_name',
        'receive_time',
        'inspection_list',
        'record_list',
        'log_list',
        'status',
        'effective',
        'create_time',
        'detail_description'
      ]
    })
    return _.first(changeShiftList)
  }
}

export {
  PatrolService
}
