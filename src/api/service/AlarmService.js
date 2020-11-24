import { BaseService } from './BaseService'
import { AlarmDao, AlarmSubDao, AlarmLatestDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'
import _ from 'lodash'
import { axios } from '@/utils/request'

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
      AlarmLatestDao.find({
        where: {
          host_id: { _in: hostIds }
        },
        fields: ['host_id', 'event_level'],
        alias: 'alarmList'
      })
    )
    return alarmList
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
    // 设备名称、监控实体、检查项、值
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

  static async close ({ hostId, endpointId, metricId }) {
    return axios.post('/redisData/closeAlarm', { hostId, endpointId, metricId })
  }
}

export {
  AlarmService
}
