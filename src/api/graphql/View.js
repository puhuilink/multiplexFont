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

// 新增视图
export const mutationInsertViews = gql`mutation ($objects: [t_view_insert_input!]! = []) {
  insert_t_view (objects: $objects) {
    affected_rows
  }
}`
