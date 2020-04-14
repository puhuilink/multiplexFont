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

export const mutationUpdateGroupViewAuth = gql`mutation ($groupId: String, $objects: [t_authorize_object_insert_input!]!) {
  delete_t_authorize_object (where: {
    group_id: {
      _eq: $groupId
    }
    object_type: {
      _eq: "4"
    }
  }) {
    affected_rows
  }
  insert_t_authorize_object (objects: $objects) {
    affected_rows
  }
}`
