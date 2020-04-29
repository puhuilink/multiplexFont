import { BaseService } from './BaseService'
import { InstanceDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'

class InstanceService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      InstanceDao.find(argus)
    )
    return res
  }
}

export {
  InstanceService
}
