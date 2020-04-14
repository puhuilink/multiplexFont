/**
 * 权限分配模块
 */

import { queryGroupViewDesktopList, queryDesktopItemList } from '../graphql/AuthorizeObject'
import { getViewList } from './View'
import apollo from '@/utils/apollo'
import store from '@/store'
import _ from 'lodash'

export const getDesktopItemList = function (desktopId) {
  return apollo.clients.alert.query({
    query: queryDesktopItemList,
    variables: {
      desktopId: Number(desktopId)
    }
  })
    .then(r => r.data.data)
    .then(r => r.map(item => ({
      ...item,
      // 老系统旧版本视图存放了 xml
      content: item.content.includes('<') ? '' : item.content
    })))
}

/**
  * 获取指定用户组能访问到的视图桌面列表
  * groupIds 长度 > 1 时，合并结果并去重
  * @param {*} groupIds
  * @return {Promise<Array<any>>}
  */
export const getGroupViewDesktopList = async function (groupIds) {
  groupIds = groupIds || store.getters.groupList.filter(el => !!el).map(({ groupId }) => groupId)
  const groupViewDesktopList = await apollo.clients.alert.query({
    query: queryGroupViewDesktopList,
    variables: {
      groupIds
    }
  }).then(r => r.data.data)
  const desktopList = []
  for await (const groupViewDesktop of groupViewDesktopList) {
    const [desktop] = await getDesktopItemList(groupViewDesktop.viewId)
    desktop.viewIds = desktop.content.split(',')
    desktop.group_id = groupViewDesktop.group_id
    desktopList.push(desktop)
  }
  const viewIds = desktopList.map(desktop => desktop.viewIds).flat(2).filter(el => !!el)
  // console.log('viewIds', viewIds)
  const viewList = await getViewList({
    where: {
      view_id: {
        _in: _.uniq(viewIds)
      },
      view_type: {
        _eq: 'h5'
      }
    },
    limit: 9999
  }).then(r => r.data.data)
  // console.log(viewList, 'viewList')
  return [viewList, desktopList]
}
