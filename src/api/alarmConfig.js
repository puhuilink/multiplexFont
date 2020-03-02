/*
 * 告警配置模块接口
 * Author: yizhu liu
 * Date: 2019-12-09 14:45:49
 * Email: lyz02413@163.com
 */

import { axios } from '@/utils/request'

const api = {
  alarmRuleList: '/alarmRule/list',
  TRList: '/TR/list',
  faultTypeList: '/faultType/list',
  forwardWayList: '/forwardWay/list'
}

export default api

/**
 * 获取告警规则列表
 * @param parameter
 * @returns {*}
 */
export function getAlarmRuleList (parameter) {
  return axios({
    url: api.alarmRuleList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取阈值规则列表
 * @param parameter
 * @returns {*}
 */
export function getTRList (parameter) {
  return axios({
    url: api.TRList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取故障类型列表
 * @param parameter
 * @returns {*}
 */
export function getFaultTypeList (parameter) {
  return axios({
    url: api.faultTypeList,
    method: 'get',
    params: parameter
  })
}

/**
 * 获取故障类型列表
 * @param parameter
 * @returns {*}
 */
export function getForwardWayList (parameter) {
  return axios({
    url: api.forwardWayList,
    method: 'get',
    params: parameter
  })
}
