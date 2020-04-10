import gql from 'graphql-tag'

export const queryList = gql`query ($where: t_baseline_policy_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_baseline_policy_order_by!]) {
  pagination: t_baseline_policy_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  t_baseline_policy (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
    bottomlinedata_provider
    bottomlinedata_range_from
    bottomlinedata_range_to
    cal_interval
    cron_expression
    cycle_count
    middledata_provider
    middlelinedata_range_from
    middlelinedata_range_to
    sample_radio
    sigma
    status
    title
    toplinedata_provider
    toplinedata_range_from
    update_time
    uuid
    toplinedata_range_to
  }
}`

export const mutationInsert = gql`mutation insert_baseline_policy ($objects: [t_baseline_policy_insert_input!]! = []) {
  insert_t_baseline_policy (objects: $objects) {
    affected_rows
  }
}`

export const mutationUpdate = gql`mutation update_baseline_policy($uuid: String, $object: t_baseline_policy_set_input) {
  update_t_baseline_policy(where: {uuid: {_eq: $uuid}}, _set: $object) {
    affected_rows
  }
}
`

export const queryAllBaselinePolicyList = gql`query {
  data: t_baseline_policy {
    label: title
    value: uuid
  }
}`

export const mutationDelete = gql`mutation delete_baseline_policy($uuids: [String!]! = []) {
  delete_t_baseline_policy(where: {uuid: {
    _in: $uuids
  }}) {
    affected_rows
  }
}
`
