import { BaseService } from '@/api/service/BaseService'
import { PatrolTaskListDao } from '../dao/index'
import { query } from '@/api/utils/hasura-orm'
class PatrolTaskListService extends BaseService {
  // 巡更记录单和审批查询
  static async find (argus = {}) {
    return query(
      PatrolTaskListDao.find(argus)
    )
  }
}

export { PatrolTaskListService }
