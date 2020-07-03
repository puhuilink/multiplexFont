export const statusList = [
  ['A', '未执行'],
  ['B', '已下载'],
  ['D', '已完成'],
  ['E', '超时完成'],
  ['F', '失败']
]

export const statusMapping = new Map(statusList)

export const stateList = [
  ['Y', '无异常'],
  ['X', '有异常']
]

export const stateMapping = new Map(stateList)

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
