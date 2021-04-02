/**
 * 巡更配置服务：设备管理
 */

import { axios } from '@/utils/request'
import { BaseService } from './BaseService'

class PatrolConfigService extends BaseService {
  static async patrolConfig (data) {
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
