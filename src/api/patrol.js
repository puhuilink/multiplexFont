// 巡检管理接口
import { axios } from '@/utils/request'

const api = {
  calendarList: '/calendar/list',
  routeList: '/route/list',
  planList: '/plan/list'
}

export default api

/**
 * 获取列表
 * @returns {*}
 */
export function getCalendar () {
  return axios({
    url: api.calendarList,
    method: 'get'
  })
}

/**
 * 获取列表
 * @param parameter
 * @returns {*}
 */
export function getRoute (parameter) {
  return axios({
    url: api.routeList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取列表
 * @param parameter
 * @returns {*}
 */
export function getPlan (parameter) {
  return axios({
    url: api.planList,
    method: 'get',
    params: parameter
  })
}
