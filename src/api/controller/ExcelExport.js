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

export const getPatrolTaskExcel = function (data) {
  return axios({
    url: '/taskInfo/exportTask',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}

export const getPatrolObjectExcel = function (data) {
  return axios({
    url: '/taskCi/exportTaskCi',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
