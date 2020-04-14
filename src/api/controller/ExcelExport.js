/**
 * 用作表格导出的后台接口封装
 */
import { axios } from '@/utils/request'

export const getHistoryEcxel = function (data) {
  return axios({
    url: '/alert/exportAlert',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
// TODO: 地址需要转换为巡检的地址
export const getPatrolTaskExcel = function (data) {
  return axios({
    url: '/taskInfo/exportTask',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

// TODO: 地址需要转换为巡检的地址
export const getPatrolObjectExcel = function (data) {
  return axios({
    url: '/taskCi/exportTaskCi',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
