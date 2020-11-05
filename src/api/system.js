//  动态基线管理
import { axios } from '@/utils/request'

const api = {
  ModifyUserPermission: '/function/changeUserFunction',
  ModifyGroupPermission: '/function/changeGroupFunction',
  UserPermission: '/function/getUserFunction',
  GroupPermission: '/function/getGroupFunction'
}

export default api

/**
 * 获取用户权限
 * @param userId
 * @returns {AxiosPromise}
 */
export function getUserPermission (userId) {
  return axios({
    url: api.UserPermission,
    method: 'get',
    params: {
      userId
    }
  })
}

/**
 * 获取用户组权限
 * @param groupId
 * @returns {AxiosPromise}
 */
export function getGroupPermission (groupId) {
  return axios({
    url: api.GroupPermission,
    method: 'get',
    params: {
      groupId
    }
  })
}

/**
 * 修改用户权限
 * @param id
 * @param authorizeObjectList
 * @returns {AxiosPromise}
 */
export function modifyUserPermission (id, authorizeObjectList) {
  return axios({
    url: api.ModifyUserPermission,
    method: 'post',
    data: {
      id,
      authorizeObjectList
    }
  })
}

/**
 * 修改用户权限
 * @param id
 * @param authorizeObjectList
 * @returns {AxiosPromise}
 */
export function modifyGroupPermission (id, authorizeObjectList) {
  return axios({
    url: api.ModifyGroupPermission,
    method: 'post',
    data: {
      id,
      authorizeObjectList
    }
  })
}
