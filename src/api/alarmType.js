/*
 *  获取告警类型接口
 * Author: yizhu liu
 * Date: 2019-12-24 15:52:43
 * Email: lyz02413@163.com
 */

import { axios } from '@/utils/request'

const api = {
  alarmTypeList: '/alarmType/list'
}

export default api

/**
 * 获取前转记录列表
 * @param parameter
 * @returns {*}
 */
export function getalarmTypeList (parameter) {
  return axios({
    url: api.alarmTypeList,
    method: 'get',
    params: parameter
  })
}
