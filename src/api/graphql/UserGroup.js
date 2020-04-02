import gql from 'graphql-tag'

export const queryGroupByUserId = gql`query ($userId: String) {
  data: t_user_group (where: {
    user_id: {
      _eq: $userId
    }
  }) {
    group {
      group_id
      group_name
      group_type
    }
  }
}`
