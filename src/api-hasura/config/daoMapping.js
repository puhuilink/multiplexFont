import {
  alert
} from './client'

const VIC_MAIN_LIST = [
  // alert,
  't_alert',
  // system
  't_audit',
  't_authorize_object',
  't_user_group',
  // model
  't_metric',
  't_model_endpoint',
  't_model_endpoint_metric',
  't_model_host_endpoint',
  't_model_host',
  't_model_metric',
  't_model_metric_oid',
  't_model_strategy',
  // patrol
  't_patrol_answer',
  't_patrol_endpoint',
  't_patrol_event',
  't_patrol_host',
  't_patrol_metric',
  't_patrol_path',
  't_patrol_plan'
]

const VIV_MAIN_MAPPING = new Map([
  ...VIC_MAIN_LIST.map(table => [table, alert])
])

export {
  VIV_MAIN_MAPPING
}
