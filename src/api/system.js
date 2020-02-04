//  动态基线管理
import { axios } from '@/utils/request'

const api = {
  userList: '/user/list',
  groupList: '/group/list',
  auditList: '/audit/list'
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
