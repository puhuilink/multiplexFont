export const ALARM_RULE_MERGE = 'merge'
export const ALARM_RULE_UPGRADE = 'upgrade'
export const ALARM_RULE_FORWARD = 'forward'
export const ALARM_RULE_RECOVER = 'recover'

const mappingArr = [
  [ALARM_RULE_MERGE, '告警合并'],
  [ALARM_RULE_UPGRADE, '告警升级'],
  [ALARM_RULE_FORWARD, '告警前转'],
  [ALARM_RULE_RECOVER, '告警消除']
]

export const ruleTypeMapping = new Map(mappingArr)

export const allRuleTypeMapping = new Map([
  ['', '全部分类'],
  ...mappingArr
])
