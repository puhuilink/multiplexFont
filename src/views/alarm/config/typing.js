
/**
 * 告警规则
 */
import moment from 'moment'
// polyfill
import replaceAll from 'string.prototype.replaceall'

export const ALARM_RULE_MERGE = 'merge'
export const ALARM_RULE_UPGRADE = 'upgrade'
export const ALARM_RULE_FORWARD = 'forward'
export const ALARM_RULE_RECOVER = 'recover'

const ruleMappingArr = [
  [ALARM_RULE_MERGE, '告警合并'],
  [ALARM_RULE_UPGRADE, '告警升级'],
  [ALARM_RULE_FORWARD, '告警前转'],
  [ALARM_RULE_RECOVER, '告警消除']
]

export const ruleTypeMapping = new Map(ruleMappingArr)

export const allRuleTypeMapping = new Map([
  ['', '全部分类'],
  ...ruleMappingArr
])

/**
 * 前转类型
 */
export const FORWARD_MODEL_EMAIL = 'EMAIL'
export const FORWARD_MODEL_SMS = 'SMS'

const modeMappingArr = [
  [FORWARD_MODEL_EMAIL, '短信'],
  [FORWARD_MODEL_SMS, '邮件']
]

export const modeTypeMapping = new Map(modeMappingArr)

export const allModeTypeMapping = new Map([
  ['', '全部分类'],
  ...modeMappingArr
])

/**
 * 前转模板
 */
export const TEMP_KEYWORD_TIME = '{time}'
export const TEMP_KEYWORD_IP = '{IP}'
export const TEMP_KEYWORD_DETAIL = '{detail}'
export const TEMP_KEYWORD_ENDPOINT = '{endpoint}'
export const TEMP_KEYWORD_LEVEL = '{level}'

const tempKeywordMappingArr = [
  [TEMP_KEYWORD_TIME, '时间'],
  [TEMP_KEYWORD_IP, 'IP'],
  [TEMP_KEYWORD_DETAIL, '详情'],
  [TEMP_KEYWORD_ENDPOINT, 'endpoint'],
  [TEMP_KEYWORD_LEVEL, '级别']
]

export const tempKeywordMapping = new Map(tempKeywordMappingArr)

export const templateMock = template => {
  let str = `${template}`
  const data = {
    [TEMP_KEYWORD_TIME]: moment().format('YYYY-MM-DD HH:mm:ss'),
    [TEMP_KEYWORD_DETAIL]: 'cpu温度过高,温度79度',
    [TEMP_KEYWORD_LEVEL]: '1'
  }
  Object
    .entries(data)
    .forEach(([keyword, mockValue]) => {
      str = replaceAll(str, keyword, mockValue)
    })
  return str
}