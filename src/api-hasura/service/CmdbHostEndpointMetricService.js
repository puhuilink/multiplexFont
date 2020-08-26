import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { CmdbHostEndpointMetricDao } from '../dao'

class CmdbHostEndpointMetricService extends BaseService {
  static async find (argus = {}) {
    const { data: { cmdbHostEndpointMetricList } } = await query(
      CmdbHostEndpointMetricDao.find({
        fields: [
          'host_id', 'endpoint_id', 'metric_id', 'metric_model_id', 'endpoint_model_id',
          'host_alias', 'endpoint_alias', 'metric_alias', 'metric_tags'
        ],
        ...argus,
        alias: 'cmdbHostEndpointMetricList'
      })
    )
    return cmdbHostEndpointMetricList
  }
}

export {
  CmdbHostEndpointMetricService
}
