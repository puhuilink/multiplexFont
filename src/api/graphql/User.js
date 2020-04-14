import gql from 'graphql-tag'

export const mutationInsertUsers = gql`mutation insert_user ($objects: [t_user_insert_input!]!, $views: [t_view_insert_input!]!) {
  # 新建用户
  insert_t_user (objects: $objects) {
    returning {
      user_id
    }
  }
  # 新建用户视图展示桌面
  insert_t_view (objects: $views) {
    affected_rows
  }
}`

export const mutationUpdateUser = gql`mutation update ($where: t_user_bool_exp!, $user: t_user_set_input) {
  update_t_user (
    where: $where,
    _set: $user
  ) {
    returning {
      staff_name
    }
  }
}`
