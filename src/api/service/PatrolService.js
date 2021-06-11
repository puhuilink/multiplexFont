import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import {
  AlarmSenderDao, UserDao,
  PatrolTaskEventHistoryDao, PatrolPlanDao, PatrolPathDao,
  PatrolTaskStatusDao
} from '../dao/index'
import { PatrolChangeShiftDao } from '../dao/PatrolChangeShiftDao'
import _ from 'lodash'
import { axios, xungeng } from '@/utils/request'

class PatrolService extends BaseService {
  // 交接班查询
  static async changeShiftFind (argus = {}) {
    return query(
      PatrolChangeShiftDao.find(argus)
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

  // 导出任务单
  static async onExport () {
    return xungeng.post('changeShift/exportChangeShift')
  }

  // 任务单异常项
  // TODO
  static async eventHistoryFind (argus = {}) {
    return query(
      PatrolTaskEventHistoryDao.find(argus)
    )
  }

  static async pathFind (argus = {}) {
    return query(
      PatrolPathDao.find(argus)
    )
  }

  static async planBatchDelete (idList = []) {
    await mutate(
      PatrolPlanDao.batchDelete({
        id: {
          _in: idList
        }
      })
    )
  }

  // 任务单查询
  static async taskFind (argus = {}) {
    return query(
      PatrolTaskStatusDao.find(argus)
    )
  }

  // 存在异常的任务单查询
  static async eventTaskFind ({ where = {}, ...argus }) {
    return this.taskFind({
      where: {
        ...where,
        // FIXME: event_occur 字段值目前未填写，暂时使用其外键 events.length 判断有无异常
        events: { id: { _nin: [] } }
        // event_occur: true
      },
      ...argus
    })
  }

  // 批量审批
  static async eventTaskBatchApprove (idList = []) {
    return mutate(
      PatrolTaskStatusDao.update({
        review: 'accomplished'
      }, { id: { _in: idList } })
    )
  }

  // 任务单下异常条目查询
  static async eventFind (argus = {}) {
    return query(
      PatrolTaskEventHistoryDao.find(argus)
    )
  }

  // 不同告警等级对应的用户列表
  static async senderConfig (res) {
    // 获取不同通知级别对应的用户 id
    // TODO: 区分 IT / 动环
    const { data: { senderList } } = await query(
      AlarmSenderDao.find({
        where: {
          event_level: {
            _in: [2, 3, 4, 5]
          },
          group_id: {
            // _like: `%巡更%`
            _in: ['XMDH', 'XMID']
          }
        },
        fields: ['event_level', 'contact', 'group_id', 'send_type'],
        alias: 'senderList'
      })
    )

    senderList.forEach(sender => {
      // 用户 id 是以 / 分隔的字符串
      sender.userIdList = sender.contact.split('/')
    })

    // 扁平化一次查询
    const allUserIdList = senderList.map(({ userIdList }) => userIdList).flat()

    // 获取用户邮箱 / 电话
    if (allUserIdList.length) {
      const { data: { allUserList } } = await query(
        UserDao.find({
          where: {
            user_id: {
              _in: _.uniq(allUserIdList)
            }
          },
          fields: ['user_id', 'staff_name', 'phone', 'mobile_phone', 'email'],
          alias: 'allUserList'
        })
      )

      senderList.forEach(sender => {
        sender.userList = allUserList.filter(({ user_id }) => sender.userIdList.includes(user_id))
        sender.send_type = sender.send_type.split('/')
      })

      // 只返回最终有效内容
      return senderList.map(({ event_level, mode, userIdList, send_type }) => {
        return {
          event_level,
          mode,
          send_type,
          userList: allUserList.filter(({ user_id }) => userIdList.includes(user_id))
        }
      })
    }
  }

  // 任务单详情
  static async taskDetail (id) {
    // const basicFields = [
    //   'task_code',
    //   'task_name',
    //   'task_id',
    //   'real_start_time',
    //   'real_end_time',
    //   'transactor_name',
    //   'is_delay'
    // ]
    const basicFields = [
      'id',
      'content'
    ]

    // const rfFields = [
    //   'file_urls',
    //   'is_enable',
    //   'memo',
    //   'rf_level_no',
    //   'rf_name',
    //   'rf_value',
    //   'route_code',
    //   'scan_type',
    //   'state',
    //   'task_code',
    //   'update_time',
    //   'urmp_rf_code',
    //   'task_rf_status',
    //   'task_rf_id'
    // ]

    const { data: { taskList } } = await this.taskFind({
      where: { id },
      fields: [
        ...basicFields
        // `rfList { ${rfFields.join(' ')} }`
      ],
      alias: 'taskList'
    })

    if (_.isEmpty(taskList)) {
      return null
    }

    const task = _.first(taskList)
    const { rfList, ...basicInfo } = task

    // TODO: host、endpoint、metric
    return {
      basicInfo
    }
  }

  // 计划查询
  static async planFind (argus = {}) {
    return query(
      PatrolPlanDao.find(argus)
    )
  }

  // 新增计划
  static async planAdd (plan = {}) {
    return mutate(
      PatrolPlanDao.add(plan)
    )
  }

  // 修改计划
  static async planUpdate (plan = {}) {
    const msg = await xungeng.post(`/plan/updateJob`, plan)
    return msg
  }

  /**
   * 改为接口校验数据正确性，是否允许添加
   */
  static async addPlan (plan = {}) {
    const msg = await xungeng.post(`/plan/addJob`, plan)
    return msg
  }

  // 更新计划
  static async planEdit (set = {}, where = {}) {
    return mutate(
      PatrolPlanDao.update(set, where)
    )
  }

  // 计划详情
  static async planDetail (id) {
    const { data: { planList } } = await query(
      PatrolPlanDao.find({
        where: { id: { _eq: id.toString() } },
        fields: [
          'id',
          'alias',
          'schedule',
          'interval',
          // TODO: 巡更组管理
          'groupId: group_id',
          'cron: schedule',
          'effectTime: effect_time',
          'expireTime: expire_time',
          'exception',
          'status'
        ],
        alias: 'planList'
      })
    )
    return _.first(planList)
  }

  // 计划管理 启用
  static async resumeJob (planId) {
    const formData = new FormData()
    formData.append('planId', planId)
    return axios.post(`plan/resumeJob`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 计划管理 停用
  static async pauseJob (planId) {
    const formData = new FormData()
    formData.append('planId', planId)
    return axios.post(`plan/pauseJob`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 二维码下载
  static async qrCode (qrId) {
    const formData = new FormData()
    formData.append('content', qrId)
    return axios.post(`qrcode/create`, formData, {
      responseType: 'arraybuffer',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 告警审批
  static async approveSend () { }

  static async getHistoryExcel (data) {
    return axios({
      url: '/alert/exportAlert',
      method: 'post',
      data,
      responseType: 'arraybuffer'
    })
  }

  static async getPatrolTaskExcel (data) {
    return axios({
      url: '/taskInfo/exportTask',
      method: 'post',
      data,
      responseType: 'arraybuffer'
    })
  }

  static async getPatrolObjectExcel (data) {
    return axios({
      url: '/taskCi/exportTaskCi',
      method: 'post',
      data,
      responseType: 'arraybuffer'
    })
  }
}

export {
  PatrolService
}
