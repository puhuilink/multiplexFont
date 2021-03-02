import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { FunctionDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'

class FunctionService extends BaseService {
  static async find (argus) {
    return query(
      FunctionDao.find(argus)
    )
  }
}

export {
  FunctionService
}
