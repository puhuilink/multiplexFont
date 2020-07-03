import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
import { XjChangeShiftDao, PatrolEventHistoryDao, XjTaskInfoDao } from '../dao'
import _ from 'lodash'

class PatrolService extends BaseService {
  // 交接班查询
  static async changeShiftFind (argus = {}) {
    return query(
      XjChangeShiftDao.find(argus)
    )
  }

  // 交接班详情
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

  // 任务单异常项
  // TODO
  static async eventHistoryFind (argus = {}) {
    return query(
      PatrolEventHistoryDao.find(argus)
    )
  }

  // 任务单查询
  static async taskFind (argus = {}) {
    return query(
      XjTaskInfoDao.find(argus)
    )
  }

  // 任务单详情
  static async taskDetail (task_id) {
    const basicFields = [
      'task_code',
      'task_name',
      'task_id',
      'real_start_time',
      'real_end_time',
      'transactor_name',
      'is_delay'
    ]

    const rfFields = [
      'file_urls',
      'is_enable',
      'memo',
      'rf_level_no',
      'rf_name',
      'rf_value',
      'route_code',
      'scan_type',
      'state',
      'task_code',
      'update_time',
      'urmp_rf_code',
      'task_rf_status',
      'task_rf_id'
    ]

    const { data: { taskList } } = await this.taskFind({
      where: { task_id },
      fields: [
        ...basicFields,
        `rfList { ${rfFields.join(' ')} }`
      ],
      alias: 'taskList'
    })

    if (_.isEmpty(taskList)) {
      return null
    }

    const task = _.first(taskList)
    const { rfList, ...basicInfo } = task

    // TODO: host、endpoint、metric
    // const { task_code } = task
    // console.log(rfList)
    return {
      basicInfo
    }
  }
}

export {
  PatrolService
}
