import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { ModelHistoryDao } from '../dao/index'

class ModelHistoryService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      ModelHistoryDao.find(argus)
    )
    return res
  }
}

export {
  ModelHistoryService
}
