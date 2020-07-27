/**
 * 视图桌面模块
 * 位于视图展示页面下
 */

// import store from '@/store'
import { queryUserDesktop, mutationUpdateDesktopContent } from '../graphql/ViewDesktop'
import apollo from '@/utils/apollo'
import { getViewList } from './View'
import _ from 'lodash'

/**
  * 获取当前用户自定义桌面
  * @param {Array<any>} groudIds
  * @return {Promise<any>}
  */
export const getUserDesktop = function (userId) {
  // console.log(
  //   queryUserDesktop(userId)
  // )
  return apollo.clients.alert.query({
    query: queryUserDesktop(userId)
  }).then(r => r.data.data).then(async r => {
    const data = Array.isArray(r) ? r[0] : r
    // console.log('data.content', data.content)
    // 老系统视图
    const { content } = data
    // data.content = data.content.includes('<') ? '' : data.content
    data.viewIds = (content.includes('<') ? [] : content.split(',')).filter(id => !!id)
    let viewList
    if (data.viewIds.length) {
      viewList = await getViewList({
        where: {
          view_id: {
            _in: _.uniq(data.viewIds)
          },
          view_type: {
            _eq: 'h5'
          }
        },
        limit: 9999
      }).then(r => r.data.data)
    } else {
      viewList = []
    }
    // console.log('viewList', viewList)
    return [viewList, data]
  })
}

/**
 * 新增用户桌面（在新增用户时）
 * @abort
 * 多个 mutation 应合并到一起提交到 hasura，在遇到异常时才能正常回滚
 * @param {*} userId
 */
// export const addUserDesktop = function (userId) {
//   const desktop = {
//     view_name: userId,
//     view_title: '自定义',
//     view_type: 'desktop',
//     creator: userId
//   }
//   return apollo.clients.alert.mutate({
//     mutation: mutationInsertDesktop,
//     variables: {
//       objects: [desktop]
//     }
//   })
// }

/**
 * 更新桌面关联的视图
 * @param {Number} desktopId 视图桌面 id
 * @param {Array<any>} viewIds 要关联的视图 id
 */
export const editDesktopContent = function (desktopId, viewIds = []) {
  return apollo.clients.alert.mutate({
    mutation: mutationUpdateDesktopContent,
    variables: {
      viewId: desktopId,
      set: {
        content: viewIds.join(',')
      }
    }
  })
}
