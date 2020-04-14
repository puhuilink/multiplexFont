import gql from 'graphql-tag'

export const mutationInsert = gql`mutation ($groups: [t_group_insert_input!]!, $views: [t_view_insert_input!]!) {
  insert_t_group (objects: $groups) {
    returning {
      group_id
    }
  }
  # 新建工作组展示桌面
  insert_t_view (objects: $views) {
    affected_rows
  }
}`

export const mutationUpdate = gql`mutation update ($where: t_group_bool_exp!, $group: t_group_set_input) {
  update_t_group (
    where: $where,
    _set: $group
  ) {
    returning {
      group_id
    }
  }
}`
