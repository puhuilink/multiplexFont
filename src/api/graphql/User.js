import gql from 'graphql-tag'

export const mutationInsertUsers = gql`mutation insert_user ($objects: [t_user_insert_input!]!) {
  insert_t_user (objects: $objects) {
    returning {
      user_id
    }
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
