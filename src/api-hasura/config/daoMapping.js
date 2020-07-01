import {
  alert
} from './client'

const VIC_MAIN_LIST = [
  // （新）告警
  { schema: 't_alarm', primaryKey: 'id' },
  { schema: 't_alarm_sub', primaryKey: 'id' },
  { schema: 't_alarm_sender', primaryKey: 'id' },
  // （旧）告警,
  { schema: 't_alert', primaryKey: 'id' },
  // 系统设置
  { schema: 't_audit', primaryKey: 'id' },
  { schema: 't_authorize_object' },
  { schema: 't_user_group', primaryKey: 'id' },
  // model
  { schema: 't_metric', primaryKey: 'id' },
  { schema: 't_model_endpoint', primaryKey: 'id' },
  { schema: 't_model_endpoint_metric', primaryKey: 'id' },
  { schema: 't_model_host_endpoint', primaryKey: 'id' },
  { schema: 't_model_host', primaryKey: 'id' },
  { schema: 't_model_metric', primaryKey: 'id' },
  { schema: 't_model_metric_oid', primaryKey: 'id' },
  { schema: 't_model_strategy', primaryKey: 'id' },
  // 巡更
  { schema: 't_patrol_answer', primaryKey: 'id' },
  { schema: 't_patrol_endpoint', primaryKey: 'id' },
  { schema: 't_patrol_event', primaryKey: 'id' },
  { schema: 't_patrol_host', primaryKey: 'id' },
  { schema: 't_patrol_metric', primaryKey: 'id' },
  { schema: 't_patrol_path', primaryKey: 'id' },
  { schema: 't_patrol_plan', primaryKey: 'id' },
  { schema: 't_xj_change_shift', primaryKey: 'id' },
  // 前转记录
  { schema: 't_send_record', primaryKey: 'id' }
]

const VIV_MAIN_MAPPING = new Map([
  ...VIC_MAIN_LIST.map(table => {
    const { schema, primaryKey, provider = alert } = table
    return [schema, { primaryKey, provider }]
  })
])

export {
  VIV_MAIN_MAPPING
}
