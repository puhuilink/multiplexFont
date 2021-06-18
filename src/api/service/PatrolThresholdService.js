import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { PatrolThresholdDao } from '@/api/dao/PatrolThresholdDao'

class PatrolThresholdService extends BaseService {
  static async find (argus = {
    fields: [
      'host_id',
      'endpoint_id',
      'lower_threshold',
      'severity',
      'upper_threshold',
      'answer_id',
      'metric_id'
    ]
  }) {
    return query(
      PatrolThresholdDao.find(argus)
    )
  }
}

export {
  PatrolThresholdService
}
