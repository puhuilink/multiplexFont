import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { PatrolMetricDao } from '../dao/index'

class PatrolMetricService extends BaseService {
  static async find (argus = {
    fields: ['id', 'alias', 'answer_id']
  }) {
    return query(
      PatrolMetricDao.find(argus)
    )
  }
}

export {
  PatrolMetricService
}
