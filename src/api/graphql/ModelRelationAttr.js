import gql from 'graphql-tag'

export const insert = gql`mutation insert_relationattribute ($objects: [ngecc_relationattribute_insert_input!]! = []) {
  insert_ngecc_relationattribute (objects: $objects) {
    affected_rows
  }
}`

export const update = gql`mutation update_relationattribute($did: Int!, $object: ngecc_relationattribute_set_input) {
  update_ngecc_relationattribute(
    where: {
      did:
        {_eq: $did}
      }
    _set: $object
  ) {
    affected_rows
  }
}
`

export const queryLastestId = gql`query MyQuery {
  data: ngecc_relationattribute_aggregate {
    aggregate {
      max {
        did
      }
    }
  }
}`
