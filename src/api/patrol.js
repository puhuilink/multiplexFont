// 巡检管理接口
import { axios } from '@/utils/request'

const api = {
  calendarList: '/calendar/list',
  routeList: '/route/list',
  planList: '/plan/list',
  taskList: '/task/list',
  objList: '/obj/list',
  objInfo: '/obj/info'
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

/**
 * 获取列表
 * @param parameter
 * @returns {*}
 */
export function getTask (parameter) {
  return axios({
    url: api.taskList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取列表
 * @param parameter
 * @returns {*}
 */
export function getObj (parameter) {
  return axios({
    url: api.objList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取信息
 * @param parameter
 * @returns {*}
 */
export function getObjInfo (parameter) {
  return axios({
    url: api.objInfo,
    method: 'get',
    params: parameter
  })
}
