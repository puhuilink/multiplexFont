import gql from 'graphql-tag'

export const insert = gql`mutation ($objects: [ngecc_model_attributes_insert_input!]! = []) {
  insert_ngecc_model_attributes (objects: $objects) {
    returning {
      rid
    }
  }
}
`

export const update = gql`mutation update ($where: ngecc_model_attributes_bool_exp!, $attr: ngecc_model_attributes_set_input) {
  update_ngecc_model_attributes (
    where: $where,
    _set: $attr
  ) {
      returning {
      rid
    }
  }
}`

export const queryLastestId = gql`query MyQuery {
  data: ngecc_model_attributes_aggregate {
    aggregate {
      max {
        rid
      }
    }
  }
}`
