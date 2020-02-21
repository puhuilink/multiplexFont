import gql from 'graphql-tag'

// import { BaselineFragment } from '../fragment/Baseline'

export const queryBaselineDefList = gql`query ($where: t_baseline_def_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_baseline_def_order_by!]) {
  pagination: t_baseline_def_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  t_baseline_def (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
    calendar_type
    ci_id
    ci_label
    ci_type_label
    ci_type_name
    cycle_day_num
    cycle_default_type
    cycle_month_num
    cycle_quarter_num
    cycle_week_num
    cycle_year_num
    gen_type
    kpi_code
    kpi_label
    round_num
    rule_id
    rule_status
    status
    title
    update_time
    uuid
    uuid_policy
  }
}`
