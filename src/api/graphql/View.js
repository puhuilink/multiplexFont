import gql from 'graphql-tag'

export const queryViewList = gql`query ($where: t_view_bool_exp! = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [t_view_order_by!]) {
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
