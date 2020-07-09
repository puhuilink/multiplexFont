export const STATUS_LIST = [
  ['pending', '待执行'],
  ['processing', '执行中'],
  ['accomplished', '已完成'],
  ['aborted', '未完成']
]

export const STATUS_MAPPING = new Map(STATUS_LIST)

export const ENABLE_LIST = [
  [0, '否'],
  [1, '是']
]

export const ENABLE_LIST_MAPPING = new Map(ENABLE_LIST)

export const planList = [
  ['A', '例行巡更'],
  ['B', '临时巡更']
]

export const ASCRIPTION_LIST = [
  ['MachineRoom-XM', '厦门数据中心'],
  ['MachineRoom-BJ', '北京数据中心']
]

export const ASCRIPTION_MAPPING = new Map(ASCRIPTION_LIST)

const delayList = [
  [1, '是'],
  [0, '否']
]

export const DELAY_MAPPING = new Map(delayList)

export const ANSWER_TYPE_SELECT = 'select'
export const ANSWER_TYPE_FILL = 'fill'

/**
 * 告警审批
 */

//  待审批
export const TASK_REVIEW_PENDING = 'pending'
// 已审批
export const TASK_REVIEW_ACCOMPLISHED = 'accomplished'

const TASK_REVIEW_LIST = [
  [TASK_REVIEW_PENDING, '待审批'],
  [TASK_REVIEW_ACCOMPLISHED, '已审批']
]

export const TASK_REVIEW_MAPPING = new Map(TASK_REVIEW_LIST)

export const ALL_TASK_REVIEW_MAPPING = new Map([
  ...TASK_REVIEW_LIST,
  ['', '全部']
])
