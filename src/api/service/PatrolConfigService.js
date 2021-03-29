/**
 * 巡更配置服务：设备管理
 */

import { BaseService } from './BaseService'
import { tableMock } from './tableMock'
// import { axios } from '@/utils/request'

class PatrolConfigService extends BaseService {
  static async patrolConfig () {
    // return axios.get('/patrol/getPatrolPath', { pathId, zoneId })
    const [floor] = tableMock.content
    return {
      data: floor.checkpoints.slice(0, 10)
    }
  }
}

export {
  PatrolConfigService
}
