import gql from 'graphql-tag'

export const queryGroupViewDesktopList = gql`query ($groupIds: [String!]) {
  data: t_authorize_object (where: {
    group_id: {
      _in: $groupIds
    },
    object_type: {
      _eq: "6"
    }
  }) {
    groupId: group_id
    group_id
    viewId: object_id
    groupInfo {
      group_name
      group_id
    }
  }
}`

export const queryDesktopItemList = gql`query ($desktopId: numeric) {
  data: t_view (where: {
    view_id: {
      _eq: $desktopId
    }
  }) {
    view_title
    view_id
    content
  }
}`
