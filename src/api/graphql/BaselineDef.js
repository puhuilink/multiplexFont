import gql from 'graphql-tag'

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

export const mutationUpdateBaselineDef = gql`mutation ($uuid: String, $set:t_baseline_def_set_input){
  update_t_baseline_def (where: {
    uuid: {
      _eq: $uuid
    }
  }, _set: $set) {
    affected_rows
  }
}`

export const mutationAddBaselintDefs = gql`mutation ($objects: [t_baseline_def_insert_input!]!) {
  data: insert_t_baseline_def (objects: $objects) {
    returning {
      uuid
    }
  }
}`

export const queryResourceInfo = gql`query ($modelName: String, $insatnceList: [String!], $kpiCodeList: [String!]) {
  # model label
  model: ngecc_model (where: {
    name_s: {
      _eq: $modelName
    }
  }) {
    label: label_s
  }
  # instance label
	ci: ngecc_instance (where: {
    _id_s: {
      _in: $insatnceList
    }
  }) {
    label: label_s
  }
  # kpi label
  kpi: ngecc_instance_values (where: {
    kpicode_s: {
      _in: $kpiCodeList
    }
  }) {
    label: label_s
  }
}`

export const mutationDeleteBaselineDefList = gql`mutation ($uuids: [String!]) {
  delete_t_baseline_calendar (where: {
    uuid_def: {
      _in: $uuids
    }
  }) {
    affected_rows
  }
  delete_t_baseline_def (where: {
    uuid: {
      _in: $uuids
    }
  }) {
    affected_rows
  }
}`
