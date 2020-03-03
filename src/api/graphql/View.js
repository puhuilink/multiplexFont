import gql from 'graphql-tag'

export const queryViewList = gql`query ($where: t_view_bool_exp! = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [t_view_order_by!] = {view_id: desc}) {
  pagination: t_view_aggregate (where: $where) {
    aggregate {
      count
    }
  }
  data: t_view (limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    view_id
    view_title
    view_name
    view_type
    creator
    view_img
  }
}`

export const mutationUpdateView = gql`mutation ($viewId: numeric!, $set: t_view_set_input! = {}) {
  update_t_view (
    where: {
      view_id: {
        _eq: $viewId
      }
    }
    _set:$set
  ) {
    affected_rows
  }
}`

export const mutationInsertViews = gql`mutation ($objects: [t_view_insert_input!]! = []) {
  insert_t_view (objects: $objects) {
    affected_rows
  }
}`
