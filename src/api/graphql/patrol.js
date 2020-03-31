import gql from 'graphql-tag'

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

export const queryUserGroupList = gql`query ($where: user_group_info_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [user_group_info_order_by!]) {
  pagination: user_group_info_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  user_group_info (where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
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
