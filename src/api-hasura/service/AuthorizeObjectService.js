import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
// t_authorize_object
import { AuthorizeObjectDao } from '../dao'

class AuthorizeObjectService extends BaseService {
  static async find (argus = {}) {
    return AuthorizeObjectDao.find(argus)
  }

  static
}

export {
  AuthorizeObjectService
}
