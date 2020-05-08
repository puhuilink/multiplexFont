import { BaseService } from './BaseService'
import { RelationAttributeDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'

class RelationAttributeService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      RelationAttributeDao.find(argus)
    )
    return res
  }
}

export {
  RelationAttributeService
}
