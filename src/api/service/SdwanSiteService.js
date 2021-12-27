import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { SdwanSiteDao } from '../dao/index'

class SdwanSiteService extends BaseService {
  static async find (argus = {}) {
    return query(
      SdwanSiteDao.find(argus)
    )
  }
}
export {
  SdwanSiteService
}
