import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { DictValueDao } from '../dao/index'

class DictValueService extends BaseService {
  static async find (argus = {}) {
    return query(
      DictValueDao.find(argus)
    )
  }
}

export {
  DictValueService
}
