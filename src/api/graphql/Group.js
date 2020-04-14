import gql from 'graphql-tag'

export const mutationInsert = gql`mutation ($objects: [t_group_insert_input!]!) {
  insert_t_group (objects: $objects) {
    returning {
      group_id
    }
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
