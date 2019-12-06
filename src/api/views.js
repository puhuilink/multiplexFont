/**
* 视图管理模块接口
* Author: dong xing
* Date: 2019/12/5
* Time: 5:29 下午
* Email: dong.xing@outlook.com
*/
import { axios } from '@/utils/request'

const api = {
  viewList: '/view/list'
}

export default api

/**
 * 获取视图列表
 * @param parameter
 * @returns {*}
 */
export function getViewList (parameter) {
  return axios({
    url: api.viewList,
    method: 'get',
    params: parameter
  })
}
