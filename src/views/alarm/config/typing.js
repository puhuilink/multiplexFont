export const ALARM_RULE_MERGE = 'merge'
export const ALARM_RULE_UPGRADE = 'upgrade'
export const ALARM_RULE_FORWARD = 'forward'
export const ALARM_RULE_RECOVER = 'recover'

export const FORWARD_MODEL_EMAIL = 'EMAIL'
export const FORWARD_MODEL_SMS = 'SMS'

const ruleMappingArr = [
  [ALARM_RULE_MERGE, '告警合并'],
  [ALARM_RULE_UPGRADE, '告警升级'],
  [ALARM_RULE_FORWARD, '告警前转'],
  [ALARM_RULE_RECOVER, '告警消除']
]

const modeMappingArr = [
  [FORWARD_MODEL_EMAIL, '短信'],
  [FORWARD_MODEL_SMS, '邮件']
]

export const ruleTypeMapping = new Map(ruleMappingArr)

export const allRuleTypeMapping = new Map([
  ['', '全部分类'],
  ...ruleMappingArr
])

export const modeTypeMapping = new Map(modeMappingArr)

export const allModeTypeMapping = new Map([
  ['', '全部分类'],
  ...modeMappingArr
])
