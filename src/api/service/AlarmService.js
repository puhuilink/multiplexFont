import { BaseService } from './BaseService'
import { AlarmDao, AlarmSubDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'
import _ from 'lodash'
import { axios } from '@/utils/request'
import { ALARM_STATE } from '@/tables/alarm/enum'

class AlarmService extends BaseService {
  static async find (argus = {}) {
    return query(
      AlarmDao.find(argus)
    )
  }

  /**
   * 批量查询指定host的最新告警等级
   * @param {*} hostIds
   */
  static async latestAlarm (hostIds) {
    if (_.isEmpty(hostIds)) return []

    const { data: { alarmList } } = await query(
      AlarmDao.find({
        where: {
          host_id: { _in: hostIds },
          state: { _eq: ALARM_STATE.unSolved }
        },
        fields: ['host_id', 'alarm_level'],
        alias: 'alarmList',
        orderBy: {
          collect_time: 'desc_nulls_last'
        }
      })
    )

    // 一个 host_id 有多条告警时，取最新一条
    return _.uniqBy(alarmList, e => e.host_id)
  }

  static async findSub (argus = {}) {
    return query(
      AlarmSubDao.find(argus)
    )
  }

  /**
   * 告警详情
   * @param {Number} 告警 id
   */
  static async detail (id) {
    // 设备名称、检查实体、检查项、值
    const deviceInfo = ['host_id ', 'endpoint_id', 'metric_id', 'agent_id']
    // alias
    const aliasInfo = ['cmdbHost { alias host_type }', 'cmdbEndpoint { modelEndpoint { alias } }', 'cmdbMetric { modelMetric { alias } }']
    // 告警编号、升级次数、告警等级、消息内容、告警状态、合并次数
    const basicInfo = ['id', 'upgrade_count', 'alarm_level', 'detail', 'state', 'merge_count']
    // 时间
    const timeInfo = ['collect_time', 'receive_time', 'upgrade_time', 'merge_time', 'close_time']

    const { data: { alarmInfo = [] } } = await query(
      // 告警信息
      AlarmDao.find({
        where: { id },
        fields: [
          ...deviceInfo,
          ...aliasInfo,
          ...basicInfo,
          ...timeInfo
        ],
        alias: 'alarmInfo'
      })
      // 前转信息
    )

    return alarmInfo[0]
  }

  /**
   * 手动管理告警
   */

  // static async close ({ hostId, endpointId, metricId }) {
  //   return axios.post('/redisData/closeAlarm', { hostId, endpointId, metricId })
  // }

  /*
  * 告警监控批量解决
  */
  static async batchClose (alarmIds = []) {
    const formData = new FormData()
    formData.append('alarmIds', alarmIds)
    return axios.post(`/AlarmAndRule/batchCloseAlarm`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }

  /**
   * 告警批量确认
   */
  static async batchComfirm (alarmIds = []) {
    const formData = new FormData()
    formData.append('alarmIds', alarmIds)
    return axios.post(`/AlarmAndRule/batchAckAlarm`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  }
}

export {
  AlarmService
}
