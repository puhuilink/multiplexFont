import { BaseService } from '@/api/service/BaseService'
import {
  CmdbHostEndpointMetricTreeDao
} from '../dao/index'
import { query } from '@/api/utils/hasura-orm'
import _ from 'lodash'
class CmdbHostEndpointMetricTreeService extends BaseService {
  /**
   * 查询对应的endpointModel
   * @param hostIds
   * @returns {Promise<void>}
   */
  static async endpointModel (hostIds) {
    const { data: { endpointModel } } = await query(
      CmdbHostEndpointMetricTreeDao.find({
        where: {
          host_id: {
            _in: hostIds
          }
        },
        fields: [
          'id: endpoint_model_id',
          'labelPre: endpoint_model_alias',
          'labelSuf: host_type'
        ],
        alias: 'endpointModel'
      })
    )
    const List = endpointModel.map(el =>
      ({
        key: el.id,
        label: el.labelPre + el.labelSuf
      })
    )
    const uniqList = _.uniqBy(List, 'label')
    return uniqList
  }

  /**
   * endpoint实例
   * @param ids
   * @param endpointModelId
   * @returns {Promise<void>}
   */
  static async endpintItem (ids, endpointModelId) {
    const { data: { endpoint } } = await query(
      CmdbHostEndpointMetricTreeDao.find({
        where: {
          host_id: {
            _in: ids
          },
          endpoint_model_id: {
            _eq: endpointModelId
          }
        },
        fields: [
          'labelPre: endpoint_alias',
          'key: endpoint_id',
          'labelSuf: host_type'
        ],
        alias: 'endpoint'
      })
    )
    const List = endpoint.map(el =>
      ({
        key: el.key,
        label: el.labelPre + el.labelSuf
      })
    )
    const unqiList = _.uniqBy(List, 'key')
    return unqiList
  }

  static async metricItem (ids, endPointModelId, metricModelId) {
    const { data: { metric } } = await query(
      CmdbHostEndpointMetricTreeDao.find({
        where: {
          host_id: {
            _in: ids
          },
          endpoint_model_id: {
            _eq: endPointModelId
          },
          metric_model_id: {
            _eq: metricModelId
          },
          metric_alias: {
            _is_null: false
          }
        },
        fields: [
          'label: metric_alias',
          'key: metric_id'
        ],
        alias: 'metric'
      })
    )
    const unqiList = _.uniqBy(metric.map(el => ({ key: el.key, label: el.label })), 'key')
    return unqiList
  }
}
export {
  CmdbHostEndpointMetricTreeService
}
