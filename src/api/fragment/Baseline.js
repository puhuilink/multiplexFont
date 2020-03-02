import gql from 'graphql-tag'

export const BaselineFragment = gql`
  fragment BaselineFragment on t_baseline_def {
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
`
