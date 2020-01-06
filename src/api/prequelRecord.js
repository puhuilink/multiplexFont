/*
 * 前传记录模块接口
 * Author: yizhu liu
 * Date: 2019-12-09 14:45:49
 * Email: lyz02413@163.com
 */

import { axios } from '@/utils/request'

const api = {
  forwardRecordList: '/forward/record/list'
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
