import { imp } from './client'

const IMP_TABLE_LIST = [
  // （新）告警
  { schema: 't_alarm', primaryKey: 'id' },
  { schema: 't_alarm_sub', primaryKey: 'id' },
  { schema: 't_alarm_sender', primaryKey: 'id' },
  { schema: 't_cmdb_strategy', primaryKey: 'id' },
  // （旧）告警,
  { schema: 't_alert', primaryKey: 'id' },
  // 系统设置
  { schema: 't_audit', primaryKey: 'id' },
  { schema: 't_authorize_object', primaryKey: 'id' },
  { schema: 't_function', primaryKey: 'code' },
  { schema: 't_user_group', primaryKey: 'id' },
  // cmdb_instance
  { schema: 't_cmdb_answer', primaryKey: 'id' },
  { schema: 't_cmdb_endpoint', primaryKey: 'endpoint_id' },
  { schema: 't_cmdb_endpoint_metric', primaryKey: 'id' },
  { schema: 't_cmdb_host_endpoint', primaryKey: 'id' },
  { schema: 't_cmdb_host', primaryKey: 'id' },
  { schema: 't_cmdb_host_view', primaryKey: 'id' }, // 关联表
  { schema: 't_cmdb_metric', primaryKey: 'id' },
  // t_dict
  { schema: 't_dict_value', primaryKey: 'value_code' },
  // cmdb_model
  { schema: 't_model_answer', primaryKey: 'id' },
  { schema: 't_model_endpoint', primaryKey: 'id' },
  { schema: 't_model_endpoint_host', primaryKey: 'id' },
  { schema: 't_model_endpoint_metric', primaryKey: 'id' },
  { schema: 't_model_host_endpoint', primaryKey: 'id' },
  { schema: 't_model_host', primaryKey: 'id' },
  { schema: 't_model_host_group_by_host_type', primaryKey: 'host_type' }, // postgre view
  { schema: 't_model_host_group_by_model', primaryKey: 'model' }, // postgre view
  { schema: 't_cmdb_host_endpoint_metric', primaryKey: 'id' }, // postgre view
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
  { schema: 't_xj_change_shift', primaryKey: 'id' },
  // 前转记录
  { schema: 't_send_record', primaryKey: 'id' },
  // 主题配置
  { schema: 't_theme', primaryKey: 'id' }
]

const IMP_DAP_MAPPING = new Map([
  ...IMP_TABLE_LIST.map(table => {
    const { schema, primaryKey, provider = imp } = table
    return [schema, { primaryKey, provider }]
  })
])

export {
  IMP_DAP_MAPPING
}
