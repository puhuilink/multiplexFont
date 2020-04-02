import gql from 'graphql-tag'

// query
export const queryRouteList = gql`query ($where: route_info_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [route_info_order_by!]) {
  pagination: route_info_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  route_info (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
      ascription
      create_time
      create_user_code
      create_user_name
      is_enable
      rf_names
      route_code
      route_id
      route_name
      update_time
    }
}`

export const queryPlanList = gql`query ($where: plan_info_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [plan_info_order_by!]) {
  pagination: plan_info_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  plan_info (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
    ascription
    create_user
    create_user_code
    end_time
    group_code
    group_member
    is_enable
    plan_code
    plan_id
    plan_name
    work_time
    update_time
    start_time
    route_code
    plan_type
    cycle_value
    cycle_type
    create_time
    }
}`

export const queryUserGroupList = gql`query{
  data:  user_group_info {
    update_time
    is_enable
    group_name
    group_id
    group_code
    create_user_code
    create_time
    ascription
    }
}`

export const queryTaskInfo = gql`query ($where: task_info_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [task_info_order_by!]) {
  pagination: task_info_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  task_info (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
    ascription
    create_time
    df_group_code
    df_transactor_code
    df_transactor_name
    group_code
    is_delay
    is_df_transactor
    is_enable
    plan_code
    plan_end_time
    plan_start_time
    real_end_time
    real_start_time
    real_sum_time
    route_code
    task_can_start_time
    task_code
    task_delay_time
    task_fail_time
    task_id
    task_late_start_time
    task_name
    task_state
    task_status
    task_type
    transactor_code
    transactor_name
    update_time
    }
}`

// mutation

export const updateRoute = gql`mutation update ($where: route_info_bool_exp!, $val: route_info_set_input) {
  update_route_info  (
    where: $where,
    _set: $val
  ) {
      returning {
        route_id
    }
  }
}`

export const updatePlan = gql`mutation update ($where: plan_info_bool_exp!, $val: plan_info_set_input) {
  update_plan_info  (
    where: $where,
    _set: $val
  ) {
      returning {
      plan_id
    }
  }
}`

// delete
export const deleteRouteArr = gql`mutation ($IDs: [Int!] = []) {
  delete_route_info (where: {
    route_id: {
      _in: $IDs
    }
  }) {
    affected_rows
  }
}`

export const deletePlanArr = gql`mutation ($IDs: [Int!] = []) {
  delete_plan_info (where: {
    plan_id: {
      _in: $IDs
    }
  }) {
    affected_rows
  }
}`
