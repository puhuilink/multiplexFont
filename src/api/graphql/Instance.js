import gql from 'graphql-tag'

export const insertInstance = gql`mutation ($objects: [ngecc_instance_insert_input!]! = []) {
  insert_ngecc_instance (objects: $objects) {
    returning {
      did
    }
  }
}`

export const updateInstance = gql`mutation update ($where: ngecc_instance_bool_exp!, $val: ngecc_instance_set_input) {
  update_ngecc_instance (
    where: $where,
    _set: $val
  ) {
      returning {
      did
    }
  }
}`

export const queryLastestId = gql`query MyQuery {
  data: ngecc_instance_aggregate {
    aggregate {
      max {
        did
      }
    }
  }
}`
