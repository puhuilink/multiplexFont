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
  */
export const getUserDesktop = function (userId) {
  return apollo.clients.alert.query({
    query: queryUserDesktop(userId)
  }).then(r => r.data.data).then(async r => {
    const data = Array.isArray(r) ? r[0] : r
    // 老系统视图
    const { content = '' } = data
    try {
      data.viewIds = (content.includes('<') ? [] : content.split(',')).filter(id => !!id)
    } catch (e) {
      data.viewIds = []
    }
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
    return [viewList, data]
  })
}

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
