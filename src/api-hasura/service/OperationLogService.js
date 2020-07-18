import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { OperationLogDao } from '../dao/index'

class OperationLogService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      OperationLogDao.find(argus)
    )
    return res
  }
}

export {
  OperationLogService
}
