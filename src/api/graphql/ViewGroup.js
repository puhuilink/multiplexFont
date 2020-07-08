import gql from 'graphql-tag'

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

// 用户授予的视图权限
export const userAuthViewList = gql`query ($userId: String) {
  data: t_authorize_object (where: {
    object_type: {
      _eq: "4"
    }
    user_id: {
      _eq: $userId
    }
  }) {
    view_id: object_id
  }
}`
