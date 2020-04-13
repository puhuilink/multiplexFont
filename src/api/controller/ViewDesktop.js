/**
 * 视图桌面模块
 * 位于视图展示页面下
 */

import store from '@/store'

/**
  * 获取当前用户能访问到的视图桌面分组与分组下包含的视图列表
  * @param {Array<any>} groudIds
  * @return {Promise<any>}
  */
export const unamed = async function (groudIds) {
  const { groupList } = store.getters
  const groupIdList = groupList.filter(el => !!el).map(({ groupId }) => groupId)
}

// export const allViewDesk
