import apollo from '@/utils/apollo'
import store from '@/store'
import { getGroupInfoByUserId } from './UserGroup'
import {
  queryViewGroupList
} from '../graphql/ViewGroup'
import { getViewList } from './View'
import _ from 'lodash'

export const getViewGroupList = async function () {
  try {
    // TODO: 在登录时就应返回用户所属组
    const { name: userId } = store.state.user
    const groupIds = (await getGroupInfoByUserId(userId)).map(group => group.group_id)
    return apollo.clients.alert.query({
      query: queryViewGroupList,
      variables: {
        viewNameList: [
          ...groupIds,
          userId
        ]
      }
    }).then(r => r.data.viewGroupList)
  } catch (e) {
    throw e
  }
}

/**
 * 获取多个分组下的所有视图
 * @param {*} groupIds
 */
export const getViewListByGroup = async function (groupIds) {
  try {
    const viewGroupList = await getViewGroupList()
    // content 应当存放关联视图的 id，老系统一些旧数据存放了 xml 等其他信息，此处需要过滤
    const filterViewGoupList = viewGroupList.filter(({ content }) => content && !content.includes('<'))
    filterViewGoupList.forEach(viewGroup => {
      viewGroup.viewIds = viewGroup.content.split(',')
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
