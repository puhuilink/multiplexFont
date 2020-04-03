import gql from 'graphql-tag'

export const queryViewGroupList = gql`query ($viewNameList: [String!]) {
  viewGroupList: t_view(where: {view_name: {_in: $viewNameList}, view_type: {_eq: "desktop"}}) {
    view_id
    view_title
    content
  }
}
`
