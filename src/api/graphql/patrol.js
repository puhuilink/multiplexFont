import gql from 'graphql-tag'

// query
export const queryRouteList = gql`query ($where: t_xj_route_info_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_xj_route_info_order_by!]) {
  pagination: t_xj_route_info_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  t_xj_route_info (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
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

export const queryPlanList = gql`query ($where: t_xj_plan_info_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_xj_plan_info_order_by!]) {
  pagination: t_xj_plan_info_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  t_xj_plan_info (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
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
  data:  t_group {
    ascription
    createdate
    domain
    creator
    flag
    group_id
    group_name
    group_type
    note
    parent_id
    updatedate
    updator
    }
}`

export const queryTaskInfo = gql`query ($where: t_xj_task_info_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_xj_task_info_order_by!]) {
  pagination: t_xj_task_info_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  t_xj_task_info (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
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

export const queryTaskCiList = gql`query ($where: t_xj_task_ci_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_xj_task_ci_order_by!]) {
  pagination: t_xj_task_ci_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  t_xj_task_ci (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
    ascription
    ci_name
    create_time
    file_urls
    is_enable
    level_no
    is_update
    memo
    route_code
    status
    task_ci_id
    task_code
    update_time
    urmp_ci_code
    urmp_rf_code
    }
}`

export const queryTaskKpi = gql`query xunjian($where: t_xj_task_kpi_bool_exp = {}) {
  t_xj_task_kpi (where: $where) {
    is_enable
    kpi_name
    kpi_value
    route_code
    task_code
    task_kpi_id
    task_kpi_status
    update_time
    urmp_ci_code
    urmp_kpi_code
    urmp_kpi_type
    urmp_kpi_value_type
  }
}`

export const queryRoutePointDetail = gql`query routePointDetail($routeCode: String!) {
  rfList: t_xj_rf_info(where: {route_code: {_eq: $routeCode}}) {
    create_time
    route_code
    rf_value
    rf_name
    urmp_rf_code
  }
  ciList: t_xj_ci_info(where: {route_code: {_eq: $routeCode}}) {
    create_time
    route_code
    ci_name
    urmp_rf_code
    urmp_ci_code
  }
  kpiList: t_xj_kpi_info(where: {route_code: {_eq: $routeCode}}) {
    urmp_kpi_type
    urmp_kpi_code
    urmp_ci_code
    route_code
    kpi_name
    kpi_id
  }
}`

export const queryTaskPointDetail = gql`query taskPointDetail($taskCode: String!) {
  rfList: t_xj_task_rf(where: {task_code: {_eq: $taskCode}}) {
    create_time
    file_urls
    is_enable
    memo
    rf_level_no
    rf_name
    rf_value
    route_code
    scan_type
    state
    task_code
    update_time
    urmp_rf_code
    task_rf_status
    task_rf_id
  }
  ciList: t_xj_task_ci(where: {task_code: {_eq: $taskCode}}) {
    ascription
    ci_name
    create_time
    file_urls
    is_enable
    is_update
    level_no
    memo
    route_code
    status
    task_ci_id
    task_code
    update_time
    urmp_ci_code
    urmp_rf_code
  }
  kpiList: t_xj_task_kpi(where: {task_code: {_eq: $taskCode}}) {
    create_time
    kpi_name
    kpi_value
    is_enable
    route_code
    task_code
    task_kpi_id
    update_time
    task_kpi_status
    urmp_ci_code
    urmp_kpi_code
    urmp_kpi_type
    urmp_kpi_value_type
  }
}`

// mutation
export const updateRoute = gql`mutation update ($where: t_xj_route_info_bool_exp!, $val: t_xj_route_info_set_input) {
  update_t_xj_route_info  (
    where: $where,
    _set: $val
  ) {
      returning {
        route_id
    }
  }
}`

export const updatePlan = gql`mutation update ($where: t_xj_plan_info_bool_exp!, $val: t_xj_plan_info_set_input) {
  update_t_xj_plan_info  (
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
  delete_t_xj_route_info (where: {
    route_id: {
      _in: $IDs
    }
  }) {
    affected_rows
  }
}`

export const deletePlanArr = gql`mutation ($IDs: [Int!] = []) {
  delete_t_xj_plan_info (where: {
    plan_id: {
      _in: $IDs
    }
  }) {
    affected_rows
  }
}`
