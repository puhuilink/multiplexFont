/**
 * 视图桌面模块
 * 位于视图展示页面下
 */

// import store from '@/store'
import { queryUserDesktop } from '../graphql/ViewDesktop'
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
    data.viewIds = data.content.split(',')
    const viewList = await getViewList({
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
    // console.log('viewList', viewList)
    return [viewList, data]
  })
}

// export const allViewDesk
