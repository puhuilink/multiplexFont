/**
 * 巡更配置服务：设备管理
 */

import { axios } from '@/utils/request'
import { BaseService } from './BaseService'

class PatrolConfigService extends BaseService {
  static async patrolConfig (data) {
    // FIXME: 返回 id 超出精度，需后端处理
    return axios({
      baseURL: process.env.VUE_APP_XUNJIAN_API_BASE_URL,
      url: '/patrol/getPatrolPath',
      method: 'post',
      data
    })
      .then(({ data }) => data)
  }
}

export {
  PatrolConfigService
}
