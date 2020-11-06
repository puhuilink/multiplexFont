import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { AlarmTempDao } from '../dao/index'

class TempService extends BaseService {
  static async find (argus = {}) {
    return query(
      AlarmTempDao.find(argus)
    )
  }

  // 监控告警模板
  static async alarmFind (argus = {}) {
    // TODO: 模板分类字段
    return this.find(argus)
  }

  // 巡更告警模板
  static async patrolFind (argus = {}) {
    // TODO: 模板分类字段
    return this.find(argus)
  }

  // 巡更告警模板（IT）
  static async patrolITFind (argus = {}) {
    // TODO: 模板分类字段
    return this.patrolFind(argus)
  }

  // 巡更告警模板（DH）
  static async patrolDHFind (argus = {}) {
    // TODO: 模板分类字段
    return this.patrolFind(argus)
  }
}

export {
  TempService
}
