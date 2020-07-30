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
  // cmdb_instance
  { schema: 't_cmdb_answer', primaryKey: 'id' },
  { schema: 't_cmdb_endpoint', primaryKey: 'endpoint_id' },
  { schema: 't_cmdb_endpoint_metric', primaryKey: 'id' },
  { schema: 't_cmdb_host_endpoint', primaryKey: 'id' },
  { schema: 't_cmdb_host', primaryKey: 'id' },
  { schema: 't_cmdb_host_group_by_host_type', primaryKey: 'id' }, // postgre view
  { schema: 't_cmdb_metric', primaryKey: 'id' },
  // cmdb_model
  { schema: 't_metric', primaryKey: 'id' },
  { schema: 't_model_answer', primaryKey: 'id' },
  { schema: 't_model_endpoint', primaryKey: 'id' },
  { schema: 't_model_endpoint_metric', primaryKey: 'id' },
  { schema: 't_model_host_endpoint', primaryKey: 'id' },
  { schema: 't_model_host', primaryKey: 'id' },
  { schema: 't_model_metric', primaryKey: 'id' },
  { schema: 't_model_metric_oid', primaryKey: 'id' },
  { schema: 't_model_strategy', primaryKey: 'id' },
  // 指标
  { schema: 't_metric', primaryKey: 'id' },
  // 巡更
  { schema: 't_patrol_answer', primaryKey: 'id' },
  { schema: 't_patrol_checkpoint', primaryKey: 'id' },
  { schema: 't_patrol_endpoint', primaryKey: 'id' },
  { schema: 't_patrol_event', primaryKey: 'id' },
  { schema: 't_patrol_task_event_history', primaryKey: 'id' },
  { schema: 't_patrol_host', primaryKey: 'id' },
  { schema: 't_patrol_metric', primaryKey: 'id' },
  { schema: 't_patrol_path', primaryKey: 'id' },
  { schema: 't_patrol_plan', primaryKey: 'id' },
  { schema: 't_patrol_task_result_history', primaryKey: 'id' },
  { schema: 't_patrol_task_status', primaryKey: 'id' },
  { schema: 't_xj_task_info', primaryKey: 'task_id' },
  { schema: 't_xj_change_shift', primaryKey: 'id' },
  { schema: 't_xj_task_rf', primaryKey: 'task_rf_id' },
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
