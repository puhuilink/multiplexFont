import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { PatrolAnswerDao } from '../dao/index'

class PatrolAnswerService extends BaseService {
  static async find (argus = {
    fields: ['id', 'alias', 'type', 'format']
  }) {
    return query(
      PatrolAnswerDao.find(argus)
    )
  }
}

export {
  PatrolAnswerService
}
