import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { InstanceHistoryDao } from '../dao/index'

class InstanceHistoryService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      InstanceHistoryDao.find(argus)
    )
    return res
  }
}

export {
  InstanceHistoryService
}
