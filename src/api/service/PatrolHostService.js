import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { PatrolHostDao } from '../dao/index'

class PatrolHostService extends BaseService {
  static async find (argus = {
    fields: ['id', 'alias', 'content']
  }) {
    return query(
      PatrolHostDao.find(argus)
    )
  }
}

export {
  PatrolHostService
}
