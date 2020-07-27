import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { AuditDao } from '../dao/index'

class AuditService extends BaseService {
  static async find (argus = {}) {
    await query(
      AuditDao.find(argus)
    )
  }
}

export {
  AuditService
}
