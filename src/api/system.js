//  动态基线管理
import { axios } from '@/utils/request'

const api = {
  userList: '/user/list',
  groupList: '/group/list',
  auditList: '/audit/list',
  modifyUserPermission: '/function/changeUserFunction',
  Permission: '/function/getUserFunction',
  GroupPermission: '/function/getGroupFunction'
}

export default api

/**
 * 获取用户列表
 * @param parameter
 * @returns {*}
 */
export function getUserList (parameter) {
  return axios({
    url: api.userList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取工作组列表
 * @param parameter
 * @returns {*}
 */
export function getGroupList (parameter) {
  return axios({
    url: api.groupList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取工作组列表
 * @param parameter
 * @returns {*}
 */
export function getAuditList (parameter) {
  return axios({
    url: api.auditList,
    method: 'get',
    params: parameter
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
    url: api.modifyUserPermission,
    method: 'post',
    data: {
      id,
      authorizeObjectList
    }
  })
}

/**
 * 获取用户权限
 * @param userId
 * @returns {AxiosPromise}
 */
export function getPermission (userId) {
  return axios({
    url: api.Permission,
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
