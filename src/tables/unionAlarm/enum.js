export const ALARM_STATE = {
  // 待处理
  unSolved: '0',
  // 已关闭
  closed: '1',
  unclaimed: '2',
  claimed: '3'
}

export const ALARM_MAP = new Map([
  ['0', '待处理'],
  ['1', '已处理'],
  ['2', '未认领'],
  ['3', '已认领']
])

export const ALARM_QUERY_LABEL = {
  level: '告警级别',
  source: '告警源',
  type: '告警类型',
  object: '告警对象',
  range: '告警时间'
}
