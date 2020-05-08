import { BaseService } from './BaseService'
import {
  RelationInstanceDao
} from '../dao/index'
import { query } from '../utils/hasura-orm/index'

class RelationInstanceService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      RelationInstanceDao.find(argus)
    )
    return res
  }
}

export {
  RelationInstanceService
}
