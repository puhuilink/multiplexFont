import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { PatrolEndpointDao } from '../dao/index'

class PatrolEndpointService extends BaseService {
  static async find (argus = {
    fields: ['id', 'alias', 'content']
  }) {
    return query(
      PatrolEndpointDao.find(argus)
    )
  }
}

export {
  PatrolEndpointService
}
