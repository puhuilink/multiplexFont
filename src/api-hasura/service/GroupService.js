import { BaseService } from './BaseService'
import {
  GroupDao
} from '../dao/index'
import { query } from '../utils/hasura-orm/index'

class GroupService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      GroupDao.find(argus)
    )
    return res
  }
}

export {
  GroupService
}
