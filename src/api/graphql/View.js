import gql from 'graphql-tag'

// 更新视图
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
