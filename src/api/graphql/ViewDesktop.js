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

// // 其他用户的自定义桌面
// const queryOtherUserDesktop = `query ($userId: String) {
//   t_view (where: {
//     view_title: {
//       _eq: "自定义"
//     }
//     view_name: {
//       _eq: $userId
//     }
//   }) {
//     view_title
//     view_name
//     view_id
//     content
//   }
// }`

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

export const mutationInsertDesktop = gql`mutation ($objects: [t_authorize_object_insert_input!]!) {
  insert_t_authorize_object (objects: $objects) {
    affected_rows
  }
}`
