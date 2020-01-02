/*
 * 指标列表接口
 * Author: yizhu liu
 * Date: 2020-01-02 16:48:38
 * Email: lyz02413@163.com
 */
import { axios } from '@/utils/request'

const api = {
  quotaList: '/quota/list'
}

export default api

/**
 * 获取列表
 * @param parameter
 * @returns {*}
 */
export function getQuotaList (parameter) {
  return axios({
    url: api.quotaList,
    method: 'get',
    params: parameter
  })
}
