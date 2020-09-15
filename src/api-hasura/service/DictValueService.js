import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
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
