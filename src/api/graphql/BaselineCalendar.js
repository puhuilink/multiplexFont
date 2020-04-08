import gql from 'graphql-tag'

// 根据动态基线定义与时间区间查询
export const queryByBaselineDefIdAndDateRange = gql`query ($baselineDefId: String, $calendarStart: date, $calendarEnd: date) {
  data: t_baseline_calendar(where: {uuid_def: {_eq: $baselineDefId}, _and: {calendar: {_gte: $calendarStart}, _and: {calendar: {_lte: $calendarEnd}}}}, order_by: {calendar: asc}) {
    calendar
    cycle_info
    status
  }
}
`
