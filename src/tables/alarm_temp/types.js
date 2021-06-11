export const SEND_TYPE_EMAIL = 'EMAIL'
export const SEND_TYPE_SMS = 'SMS'

export const SEND_TYPE_LIST = [
  [SEND_TYPE_EMAIL, '邮箱'],
  [SEND_TYPE_SMS, '短信']
]

export const SEND_TYPE_MAPPING = new Map(SEND_TYPE_LIST)
export const ALL_SEND_TYPE_MAPPING = new Map([
  ['', '全部分类'],
  ...SEND_TYPE_LIST
])

export const TEMP_KEYWORD_LEVEL = '{level}'
export const TEMP_KEYWORD_LEVEL_DESC = '{levelDesc}'
export const TEMP_KEYWORD_TIME = '{time}'
export const TEMP_KEYWORD_IP = '{IP}'
export const TEMP_KEYWORD_DETAIL = '{detail}'
export const TEMP_KEYWORD_HOST = '{hostAlias}'
export const TEMP_KEYWORD_ENDPOINT = '{endpointAlias}'
export const TEMP_KEYWORD_METRIC = '{metricAlias}'
export const TEMP_KEYWORD_ORIGIN = '{origin}'

export const PATROL_LEVEL = '{SEVERITY}' // 告警等级
export const PATROL_LEVEL_ALIAS = '{SEVERITY_ALIAS}' // 告警等级描述
export const PATROL_ZONE = '{ZONE_ALIAS}' // 区域名称
export const PATROL_CHECKPOINT = '{CHECKPOINT_ALIAS}' // 点位名称
export const PATROL_HOST = '{HOST_ALIAS}' // 设备名称
export const PATROL_ENDPOINT = '{ENDPOINT_ALIAS}' // 检查项名称
export const PATROL_METRIC = '{METRIC_ALIAS}' // 指标名称
export const PATROL_ANSWER = '{ANSWER_ALIAS}' // 指标状态/数值
export const PATROL_EXECUTOR = '{EXECUTOR}' // 巡更人员
export const PATROL_TIME = '{TIME}' // 告警时间

export const TEMP_PATROL_LIST = [
  [PATROL_LEVEL, '告警等级'],
  [PATROL_LEVEL_ALIAS, '告警等级描述'],
  [PATROL_CHECKPOINT, '点位名称'],
  [PATROL_HOST, '设备名称'],
  [PATROL_ZONE, '区域名称'],
  [PATROL_ENDPOINT, '检查项名称'],
  [PATROL_METRIC, '指标名称'],
  [PATROL_ANSWER, '指标状态/数值'],
  [PATROL_EXECUTOR, '巡更人员'],
  [PATROL_TIME, '告警时间']
]

export const TEMP_KEYWORD_LIST = [
  [TEMP_KEYWORD_LEVEL, '告警等级'],
  [TEMP_KEYWORD_LEVEL_DESC, '告警等级描述'],
  [TEMP_KEYWORD_ORIGIN, '数据域'],
  [TEMP_KEYWORD_HOST, '设备名称'],
  [TEMP_KEYWORD_ENDPOINT, '检查项名称'],
  [TEMP_KEYWORD_METRIC, '指标名称'],
  [TEMP_KEYWORD_TIME, '告警时间'],
  [TEMP_KEYWORD_IP, 'IP'],
  [TEMP_KEYWORD_DETAIL, '详情']
]

export const TEMP_KEYWORD_MAPPING = new Map(TEMP_KEYWORD_LIST)

export const TEMP_PATROL_MAPPING = new Map(TEMP_PATROL_LIST)
