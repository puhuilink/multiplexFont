import { imp } from './client'

const IMP_TABLE_LIST = [
  // 告警
  { schema: 't_alarm' },
  { schema: 't_alarm_sub' },
  { schema: 't_alarm_sender' },
  { schema: 't_cmdb_strategy' },
  // 系统设置
  { schema: 't_audit', primaryKey: 'audit_id' },
  { schema: 't_authorize_object' },
  { schema: 't_function', primaryKey: 'code' },
  { schema: 't_user_group' },
  // 实例
  { schema: 't_cmdb_endpoint', primaryKey: 'endpoint_id' },
  { schema: 't_cmdb_endpoint_metric', primaryKey: 'metric_id' },
  { schema: 't_cmdb_host_endpoint' },
  { schema: 't_cmdb_host' },
  { schema: 't_cmdb_host_view' }, // 关联表
  { schema: 't_cmdb_metric' },
  { schema: 't_cmdb_host_tree' }, // 业务系统关系表
  { schema: 't_cmdb_host_endpoint_metric_tree' }, // 业务系统完整映射表
  // 字典
  { schema: 't_dict_value', primaryKey: 'value_code' },
  // 模型
  { schema: 't_model_endpoint' },
  { schema: 't_model_endpoint_host' },
  { schema: 't_model_endpoint_metric' },
  { schema: 't_model_host_endpoint' },
  { schema: 't_model_host' },
  { schema: 't_model_host_group_by_host_type', primaryKey: 'host_type' }, // postgre view
  { schema: 't_model_host_group_by_model', primaryKey: 'model' }, // postgre view
  { schema: 't_cmdb_host_endpoint_metric' }, // postgre view
  { schema: 't_model_metric' },
  { schema: 't_cmdb_host_model_brand' },
  // 指标
  { schema: 't_metric' },
  // 巡更
  { schema: 't_patrol_answer' },
  { schema: 't_patrol_checkpoint' },
  { schema: 't_patrol_endpoint' },
  { schema: 't_patrol_event' },
  { schema: 't_patrol_task_event_history' },
  { schema: 't_patrol_host' },
  { schema: 't_patrol_metric' },
  { schema: 't_patrol_path' },
  { schema: 't_patrol_plan' },
  { schema: 't_patrol_task_result_history' },
  { schema: 't_patrol_task_status' },
  { schema: 't_xj_change_shift' },
  { schema: 'v_patrol_task_list' },
  // 告警发送记录
  { schema: 't_send_record' },
  // 主题
  { schema: 't_theme' },
  // 动环
  { schema: 't_xm_paess_metric' },
  // SDWAN
  { schema: 't_sdwan_site' },
  { schema: 't_mv_site_info' },
  { schema: 't_sdwan_connection' },
  { schema: 't_sdwan_cpe' },
  { schema: 't_sdwan_wan' }

]

const IMP_DAO_MAPPING = new Map([
  ...IMP_TABLE_LIST.map(table => {
    const { schema, primaryKey = 'id', provider = imp } = table
    return [schema, { primaryKey, provider }]
  })
])

export {
  IMP_DAO_MAPPING
}
