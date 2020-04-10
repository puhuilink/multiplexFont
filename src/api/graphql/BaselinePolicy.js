import gql from 'graphql-tag'

export const mutationInsert = gql`mutation insert_baseline_policy ($objects: [t_baseline_policy_insert_input!]! = []) {
  insert_t_baseline_policy (objects: $objects) {
    affected_rows
  }
}`

export const mutationUpdate = gql`mutation update_baseline_policy($uuid: String, $object: t_baseline_policy_set_input) {
  update_t_baseline_policy(where: {uuid: {_eq: $uuid}}, _set: $object) {
    affected_rows
  }
}
`
