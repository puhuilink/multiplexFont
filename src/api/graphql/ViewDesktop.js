import gql from 'graphql-tag'
import { parse } from 'graphql'

// 超级管理员自定义桌面
// FIXME: 初始化写死？
const queryAdministratorDesktop = `{
  data: t_view_by_pk (view_id: 1) {
    view_title
    view_name
    view_id
    content
  }
}`

export const queryUserDesktop = (userId) => {
  if (userId === 'administrator') {
    return parse(queryAdministratorDesktop)
  } else {
    return parse(`{
      data: t_view (where: {
        view_title: {
          _eq: "自定义"
        }
        view_name: {
          _eq: "${userId}"
        }
      }) {
        view_title
        view_name
        view_id
        content
      }
    }`)
  }
}

export const mutationUpdateDesktopContent = gql`mutation ($viewId: numeric, $set: t_view_set_input) {
  update_t_view(where: {view_id: {_eq: $viewId}}, _set: $set) {
    affected_rows
  }
}
`
