import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import {
  AlarmSenderDao, UserDao,
  PatrolTaskEventHistoryDao, PatrolPlanDao, PatrolPathDao,
  PatrolTaskStatusDao, PatrolTaskReportViewDao
} from '../dao/index'
import { PatrolChangeShiftDao } from '../dao/PatrolChangeShiftDao'
import { PatrolChangeShiftEventDao } from '../dao/PatrolChangeShiftEventDao'
import _ from 'lodash'
import { axios, sql, xungeng } from '@/utils/request'
import { decrypt } from '@/utils/aes'
import moment from 'moment-timezone'
import { dealQuery, sqlResultDealer } from '@/utils/util'

class PatrolService extends BaseService {
  // 交接班查询
  static async changeShiftFind (argus = {}) {
    return query(
      PatrolChangeShiftDao.find(argus)
    )
  }

  // 交接班详情
  static async changeShiftDetail (id) {
    // const { data: { changeShiftList } } = await this.changeShiftFind({
    //   where: { id },
    //   alias: 'changeShiftList',
    //   fields: [
    //     'hand_name',
    //     'hand_time',
    //     'receive_name',
    //     'receive_time',
    //     'status'
    //     // 'tool',
    //     // 'data',
    //     // 'monitor_status',
    //     // 'temperature',
    //     // 'humidity',
    //     // 'sanitary'
    //   ]
    // })
    // const res = dealQuery(await sql(`select pcse.remark remark, pcse.status eventStatus from patrol_change_shift_event pcse
    // where pcse.change_shift_id = '${id}';`))
    // Object.assign(changeShiftList, { event: res })
    // console.log('res', changeShiftList[0], res)
    // return Object.assign(_.first(changeShiftList), { event: res })
    const { data } = await xungeng.get('/changeShifts/detail', {
      params: {
        changeShiftId: id
      }
    })
    return data
  }

  // 遗留事项详情
  static async changeShiftDefect (id) {
    const { data: { data } } = await xungeng.post('/changeShifts/detail', { id: id })
    return {
      id: '360027098783416320',
      handAccount: 'nl3uoMkuIH3lNZ4q2aRYaQ==',
      handName: '动环巡更公共账号',
      handTime: '2023-06-21 11:39:09',
      status: 0,
      taskId: '8026',
      groupId: '234567890098788',
      events: [
        {
          id: '360027098783416321',
          changeShiftId: '360027098783416320',
          parentId: '360026797443645441',
          remark: '233',
          status: 0
        },
        {
          id: '360027098783416322',
          changeShiftId: '360027098783416320',
          remark: '遗留事项2',
          status: 1
        }
      ]
    }
  }

  static async taskReportDetail (task_id, zone_id = '1267708678362894336') {
    let baseSql = `select 
    point_alias,
    host_alias,
    endpoint_alias,
    metric_alias,
    format,
    type,
    tags,
    position,
    value from t_patrol_task_report_view where task_id = ${task_id} and zone_id = ${zone_id} order by 
    sequence`
    baseSql += ';'
    const result = await sql(baseSql)
    return sqlResultDealer(result)
  }

  // 导出交接班记录
  static async onExport (selectRow) {
    return xungeng({
      url: 'export/ChangeShift',
      method: 'post',
      data: selectRow,
      responseType: 'arraybuffer'
    })
  }

  // 任务单异常项
  // TODO
  static async eventHistoryFind (argus = {}) {
    return query(
      PatrolTaskEventHistoryDao.find(argus)
    )
  }

  static async reportFind (argus = {}) {
    return query(PatrolTaskReportViewDao.find(argus))
  }

  static async pathFind (argus = {}) {
    return query(
      PatrolPathDao.find(argus)
    )
  }

  static async planBatchDelete (idList = []) {
    await xungeng.post(`/plan/deleteJob?planId=${idList[0]}`)
  }

  // 任务单查询
  static async taskFind (argus = {}) {
    return query(
      PatrolTaskStatusDao.find(argus)
    )
  }

  static async hostFind () {
    return this.hasuraQuery('select id,alias,content from t_patrol_host')
  }

  static async endpointFind () {
    return this.hasuraQuery('select id,alias,content from t_patrol_endpoint')
  }

  static async metricFind () {
    return this.hasuraQuery('select id,alias,answer_id from t_patrol_metric')
  }

  static async answerFind () {
    return this.hasuraQuery('select id,alias,type,format from t_patrol_answer')
  }

  static async thresholdFind () {
    return this.hasuraQuery('select host_id,endpoint_id,metric_id,answer_id,condition,lower_threshold,' +
      'upper_threshold,severity from t_patrol_threshold')
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
  static async eventTaskBatchApprove (idList = [], user = {}) {
    const { id } = user
    return mutate(
      PatrolTaskStatusDao.update({
        review: '1',
        reviewer: id,
        review_time: moment().tz('Asia/ShangHai').format()
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

  // 审批预览
  static async previewApproval (taskId, res) {
    const ids = res.map(el => el.id)
    try {
      const { code, data } = await xungeng.post('/approval/preview', { 'taskId': taskId, 'eventIds': ids })
      if (code === 200) {
        data.map(el => {
          if (el.contact) {
            el.contact = decrypt(el.contact)
          }
          return el
        })
        return data
      }
    } catch (e) {
      this.$notifyError(e)
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
    return xungeng.post(`plan/resumeJob`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  // 计划管理 停用
  static async pauseJob (planId) {
    const formData = new FormData()
    formData.append('planId', planId)
    return xungeng.post(`plan/pauseJob`, formData, {
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
  static async approveSend () {
  }

  static async getHistoryExcel (data) {
    return axios({
      url: '/alert/exportAlert',
      method: 'post',
      data,
      responseType: 'arraybuffer'
    })
  }

  static async getPatrolTaskExcel (data) {
    const json = { taskId: data }
    return xungeng({
      url: '/export/taskHistory',
      method: 'post',
      data: json,
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
