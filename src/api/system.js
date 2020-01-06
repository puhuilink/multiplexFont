//  动态基线管理
import { axios } from '@/utils/request'

const api = {
  userList: '/user/list'
}

export default api

/**
 * 获取列表
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
