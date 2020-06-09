import { BaseService } from './BaseService'
import { AlertDao } from '../dao'
import { query } from '../utils/hasura-orm/index'

export class AlertService extends BaseService {
  static find (argus = {}) {
    return query(
      AlertDao.find(argus)
    )
  }
}
