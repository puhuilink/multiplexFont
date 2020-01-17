/*
 * 前传记录模块接口
 */

import { axios } from '@/utils/request'

const api = {
  forwardRecordList: '/forwardRecord/list'
}

export default api

/**
 * 获取前转记录列表
 * @param parameter
 * @returns {*}
 */
export function getForwardRecordList (parameter) {
  return axios({
    url: api.forwardRecordList,
    method: 'get',
    params: parameter
  })
}
