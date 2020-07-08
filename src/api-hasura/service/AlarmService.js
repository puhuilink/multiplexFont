import { BaseService } from './BaseService'
import { AlarmDao, AlarmSubDao } from '../dao'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'

class AlarmService extends BaseService {
  static async find (argus = {}) {
    return query(
      AlarmDao.find(argus)
    )
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
    const deviceInfo = ['host_id', 'endpoint_id', 'metric_id', 'agent_id']
    // 告警编号、升级次数、告警等级、消息内容、告警状态、合并次数
    const basicInfo = ['id', 'upgrade_count', 'alarm_level', 'detail', 'state', 'merge_count']
    // 升级时间、合并时间、关闭时间
    const timeInfo = ['upgrade_time', 'merge_time', 'close_time']

    const { data: { alarmInfo = [] } } = await query(
      // 告警信息
      AlarmDao.find({
        where: { id },
        fields: [...deviceInfo, ...basicInfo, ...timeInfo],
        alias: 'alarmInfo'
      })
      // 前转信息
    )

    return alarmInfo[0]
  }
}

export {
  AlarmService
}
