//  动态基线管理
import { axios } from '@/utils/request'

const api = {
  strategyList: '/policy/list',
  definitionList: '/definition/list'
}

export default api

/**
 * 获取列表
 * @param parameter
 * @returns {*}
 */
export function getStrategyList (parameter) {
  return axios({
    url: api.strategyList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取列表
 * @param parameter
 * @returns {*}
 */
export function getDefinitionList (parameter) {
  return axios({
    url: api.definitionList,
    method: 'get',
    params: parameter
  })
}
