/*
 * 生成故障接口
 * Author: yizhu liu
 * Date: 2019-12-23 18:04:08
 * Email: lyz02413@163.com
 */

import { axios } from '@/utils/request'

const api = {
  generateFaultList: '/forward/record/list'
}

export default api

/**
 * 获取前转记录列表
 * @param parameter
 * @returns {*}
 */
export function getGenerateFaultList (parameter) {
  return axios({
    url: api.generateFaultList,
    method: 'get',
    params: parameter
  })
}
