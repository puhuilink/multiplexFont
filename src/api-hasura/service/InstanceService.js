import { BaseService } from './BaseService'
import { InstanceDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'

class InstanceService extends BaseService {
  static async find (argus = {}) {
    await query(
      InstanceDao.find(argus)
    )
  }
}

export {
  InstanceService
}
