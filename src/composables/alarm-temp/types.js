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
