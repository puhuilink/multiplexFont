import { CmdbEndpointDao } from '../dao/index'
import { BaseService } from '@/api/service/BaseService'
import { query } from '../utils/hasura-orm/index'
class CmdbEndpointService extends BaseService {
  static async find (args = {}) {
    return query(
      CmdbEndpointDao.find(args)
    )
  }
}

export {
  CmdbEndpointService
}
