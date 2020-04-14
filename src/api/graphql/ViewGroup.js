import gql from 'graphql-tag'

// 工作组桌面
export const queryViewGroupList = gql`query ($viewNameList: [String!]) {
  viewGroupList: t_view(where: {view_name: {_in: $viewNameList}, view_type: {_eq: "desktop"}}) {
    view_id
    view_title
    content
  }
}
`

// 工作组授予的视图权限
export const groupAuthViewList = gql`query ($groupId: String) {
  data: t_authorize_object (where: {
    object_type: {
      _eq: "4"
    }
    group_id: {
      _eq: $groupId
    }
  }) {
    view_id: object_id
  }
}`
