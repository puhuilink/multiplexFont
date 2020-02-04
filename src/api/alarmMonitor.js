/*
 * 告警监控模块接口
 * Author: yizhu liu
 * Date: 2019-12-09 14:45:49
 * Email: lyz02413@163.com
 */

import { axios } from '@/utils/request'

const api = {
  alarmList: '/alarm/list',
  alarmMenuList: '/alarm/menu/list',
  alarmLevelList: '/alarm/level/list'
}

export default api

/**
 * 获取告警监控列表
 * @param parameter
 * @returns {*}
 */
export function getAlarmList (parameter) {
  return axios({
    url: api.alarmList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取告警监控tab列表
 * @param parameter
 * @returns {*}
 */
export function getAlarmMenuList () {
  return axios({
    url: api.alarmMenuList,
    method: 'get'
  })
}

/**
 * 获取告警监控级别数据
 * @param parameter
 * @returns {*}
 */
export function getAlarmLevelList () {
  return axios({
    url: api.alarmLevelList,
    method: 'get'
  })
}
