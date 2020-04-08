import apollo from '@/utils/apollo'
import store from '@/store'
// import { getGroupInfoByUserId } from './UserGroup'
import {
  queryViewGroupList
} from '../graphql/ViewGroup'
import { getViewList } from './View'
import _ from 'lodash'

export const getViewGroupList = async function () {
  try {
    const { name: userId } = store.state.user
    const groupIds = (store.state.user.info.organizeList).filter(el => !!el).map(({ groupId }) => groupId)
    return apollo.clients.alert.query({
      query: queryViewGroupList,
      variables: {
        viewNameList: _.uniq([
          ...groupIds,
          // 当用户是 administrator 时，其组名与用户名一样
          userId
        ])
      }
    }).then(r => r.data.viewGroupList)
  } catch (e) {
    throw e
  }
}

/**
 * 获取多个分组下的所有视图
 * @param {*} groupIds
 * @FIXME: 用户登录时有其相应视图权限，可以直接拿到，目前登录接口未返回权限部分
 */
export const getViewListByGroup = async function (groupIds) {
  try {
    const viewGroupList = await getViewGroupList()
    console.log('viewGroupList', viewGroupList)
    // content 应当存放关联视图的 id，老系统一些旧数据存放了 xml 等其他信息，此处需要过滤
    const filterViewGoupList = viewGroupList.filter(({ content }) => content && !content.includes('<'))
    filterViewGoupList.forEach(viewGroup => {
      // viewId 本身为 numeric 类型
      viewGroup.viewIds = viewGroup.content.split(',').map(id => Number(id))
    })
    // 拉平所有需要查询的数组，并去重
    const viewIds = _.uniq(
      filterViewGoupList.map(({ viewIds }) => viewIds).flat(2)
    )
    const viewList = await getViewList({
      where: {
        view_id: {
          _in: viewIds
        },
        view_type: {
          _eq: 'h5'
        }
      },
      limit: 9999
    }).then(r => r.data.data)
    return [viewList, filterViewGoupList]
  } catch (e) {
    throw e
  }
}
