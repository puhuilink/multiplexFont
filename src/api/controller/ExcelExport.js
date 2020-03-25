/**
 * 用作表格导出的后台接口封装
 */
import { axios } from '@/utils/request'

export function getHistoryEcxel (data) {
  return axios({
    url: '/alert/exportAlert',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}
