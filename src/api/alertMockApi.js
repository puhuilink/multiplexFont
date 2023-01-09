import axios from 'axios'
const baseUrl = 'http://127.0.0.1:3000/mock/11'
// 告警源列表
function getAlertSourceList () {
  return axios.get(baseUrl + '/platform/query/getAlertSourceList')
}
// 更新告警源
function updateAlertSourceById (body) {
  return axios.post(baseUrl + '/platform/update/updateAlertSourceById', body)
}
// 删除告警源
function removeAlertSourceById (body) {
  return axios.post(baseUrl + '/platform/delete/removeAlertSourceById', body)
}
// 告警源详情
function getAlertSourceInfo (body) {
  return axios.post(baseUrl + '/platform/query/getAlertSourceInfo', body)
}
// 获取平台映射关系
function getPlatformMapping (body) {
  return axios.post(baseUrl + '/platform/query/getPlatformMapping', body)
}
// 增加告警源
function addAlertSource (body) {
  return axios.post(baseUrl + '/platform/create/addAlertSource', body)
}
// 修改接入平台
function updatePlatform (body) {
  return axios.post(baseUrl + '/platform/update/updatePlatform', body)
}
// 查询平台下告警源
function getPlatformAlertSourceList (body) {
  return axios.post(baseUrl + '/platform/query/getPlatformAlertSourceList', body)
}
// 删除平台
function removePlatformById (body) {
  return axios.post(baseUrl + '/platform/delete/removePlatformById', body)
}
// 添加接入平台
function addPlatform (body) {
  return axios.post(baseUrl + '/platform/create/addPlatform', body)
}
// 平台列表
function getPlatformList () {
  return axios.get(baseUrl + '/platform/query/getPlatformList')
}
// 获取工作时间
function getWorkingTime () {
  return axios.get(baseUrl + '/notify/query/getWorkingTime')
}
// 通知策略列表
function getAllNotifyStrategy () {
  return axios.get(baseUrl + '/notify/query/getAllNotifyStrategy')
}
// 获取单个通知策略
function getNotifyRuleByIds (body) {
  return axios.post(baseUrl + '/notify/query/getNotifyRuleByIds', body)
}
// 修改工作时间
function changeWorkingTime (body) {
  return axios.post(baseUrl + '/notify/update/changeWorkingTime', body)
}
// 修改通知策略
function changeNotifyRuleById (body) {
  return axios.post(baseUrl + '/notify/update/changeNotifyRuleById', body)
}
// 删除通知策略
function removeNotifyStrategyById (body) {
  return axios.post(baseUrl + '/notify/delete/removeNotifyStrategyById', body)
}
// 删除通知规则
function removeNotifyRuleByIds (body) {
  return axios.post(baseUrl + '/notify/delete/removeNotifyRuleByIds', body)
}
// 新增通知策略
function addNotifyStrategy (body) {
  return axios.post(baseUrl + '/notify/create/addNotifyStrategy', body)
}
// 修改分派策略
function updateDistributeStrategy (body) {
  return axios.post(baseUrl + '/distribute/update/updateDistributeStrategy', body)
}
// 分派策略列表
function getDistributeStrategyList () {
  return axios.get(baseUrl + '/distribute/query/getDistributeStrategyList')
}
// 删除分派策略
function removeDistributeStrategyById (body) {
  return axios.post(baseUrl + '/distribute/delete/removeDistributeStrategyById', body)
}
// 新增分派策略
function addDistributeStrategy (body) {
  return axios.post(baseUrl + '/distribute/create/addDistributeStrategy', body)
}
// 屏蔽规则列表
function getShields () {
  return axios.get(baseUrl + '/platform/query/getShields')
}
// 修改屏蔽规则
function changeShieldRule (body) {
  return axios.post(baseUrl + '/shield/update/changeShieldRule', body)
}
// 修改屏蔽规则状态
function changeShieldRuleStatusById (body) {
  return axios.post(baseUrl + '/shield/update/changeShieldRuleStatusById', body)
}
// 删除屏蔽规则
function removeShieldRuleById (body) {
  return axios.post(baseUrl + '/shield/delete/removeShieldRuleById', body)
}
// 新增屏蔽规则
function addShieldRule (body) {
  return axios.post(baseUrl + '/shield/create/addShieldRule', body)
}

export {
  addPlatform,
  addShieldRule,
  addAlertSource,
  addNotifyStrategy,
  addDistributeStrategy,
  getAlertSourceList,
  getShields,
  getAllNotifyStrategy,
  getNotifyRuleByIds,
  getPlatformList,
  getPlatformMapping,
  getWorkingTime,
  getPlatformAlertSourceList,
  getDistributeStrategyList,
  getAlertSourceInfo,
  updatePlatform,
  updateDistributeStrategy,
  updateAlertSourceById,
  removeDistributeStrategyById,
  removeNotifyRuleByIds,
  removeNotifyStrategyById,
  removePlatformById,
  removeShieldRuleById,
  removeAlertSourceById,
  changeNotifyRuleById,
  changeWorkingTime,
  changeShieldRuleStatusById,
  changeShieldRule
}
