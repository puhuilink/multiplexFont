import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { CmdbHostEndpointMetricDao } from '../dao/index'

class CmdbHostEndpointMetricService extends BaseService {
  static async find (argus = {}) {
    return query(
      CmdbHostEndpointMetricDao.find({
        fields: [
          'host_id', 'endpoint_id', 'metric_id', 'metric_model_id', 'endpoint_model_id',
          'host_alias', 'endpoint_alias', 'metric_alias', 'metric_tags'
        ],
        alias: 'cmdbHostEndpointMetricList',
        ...argus
      })
    )
  }
  static async findCommon (argus = {}) {
    const q = await query(
      CmdbHostEndpointMetricDao.find(argus)
    )
    return q
  }
}

export {
  CmdbHostEndpointMetricService
}
