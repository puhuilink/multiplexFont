export const ALARM_STATE = {
  // 未解决
  unSolved: '0',
  // 已解决
  solved: '1'
}

export const ALARM_ACK_STATUS = {
  // 已确认
  unAck: 0,
  Ack: 1
}

export const ALARM_ACK_MAP = new Map([
  [0, '未确认'],
  [1, '已确认']
])
