export const statusList = [
  ['pending', '待执行'],
  ['processing', '执行中'],
  ['accomplished', '已完成'],
  ['aborted', '未完成']
]

export const statusMapping = new Map(statusList)

export const enableList = [
  [0, '否'],
  [1, '是']
]

export const enableMapping = new Map(enableList)

export const planList = [
  ['A', '例行巡更'],
  ['B', '临时巡更']
]

export const ascriptionList = [
  ['MachineRoom-XM', '厦门数据中心'],
  ['MachineRoom-BJ', '北京数据中心']
]

export const ascriptionMapping = new Map(ascriptionList)

const delayList = [
  [1, '是'],
  [0, '否']
]

export const delayMapping = new Map(delayList)
