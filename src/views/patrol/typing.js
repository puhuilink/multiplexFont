export const STATUS_LIST = [
  ['0', '未开始'],
  ['1', '进行中'],
  ['3', '超时完成'],
  ['10', '告警完成'],
  ['20', '无告警完成'],
  ['30', '已过期']
]

export const LEVEL_LIST = [
  ['1', '一级（紧急告警）'],
  ['2', '二级（主要告警）'],
  ['3', '三级（次要告警）'],
  ['4', '四级（一般告警）'],
  ['5', '五级（警告）']
]

export const STATUS_MAPPING = new Map(STATUS_LIST)

export const ENABLE_LIST = [
  [false, '否'],
  [true, '是']
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

const DELAY_LIST = [
  [1, '是'],
  [0, '否']
]

export const DELAY_MAPPING = new Map(DELAY_LIST)

export const ANSWER_TYPE_SELECT = 'select'
export const ANSWER_TYPE_FILL = 'fill'

/**
 * 告警审批
 */

//  待审批
export const TASK_REVIEW_PENDING = '0'
// 已审批
export const TASK_REVIEW_ACCOMPLISHED = '1'

const TASK_REVIEW_LIST = [
  [TASK_REVIEW_PENDING, '待审批'],
  [TASK_REVIEW_ACCOMPLISHED, '已审批']
]

export const ALL_TASK_REVIEW_LIST = [
  ...TASK_REVIEW_LIST,
  ['', '全部']
]

export const TASK_REVIEW_MAPPING = new Map(TASK_REVIEW_LIST)

export const LEVEL_MAPPING = new Map(LEVEL_LIST)

export const ALL_TASK_REVIEW_MAPPING = new Map(ALL_TASK_REVIEW_LIST)
export const PLAN_STATUS_ENABLED = 'enabled'
export const PLAN_STATUS_DISABLED = 'disabled'

const PLAN_STATUS_LIST = [
  [PLAN_STATUS_ENABLED, '停用'],
  [PLAN_STATUS_DISABLED, '启用']
]

export const PLAN_STATUS_MAPPING = new Map(PLAN_STATUS_LIST)

export const SHIFT_STATUS_MAPPING = new Map(
  [
    ['0', '已关闭'],
    ['1', '已交班'],
    ['2', '已接班']]
)
