import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
// eslint-disable-next-line no-unused-vars
import {
  ModelHostDao,
  CmdbHostDao, CmdbEndpointMetricDao, CmdbHostEndpointDao, CmdbHostGroupByHostTypeDao,
  MetricDao
} from '../dao'
class CmdbService extends BaseService {
  // FIXME: host 与 endpoint 并非一定是树形结构
  static async modelTree () {
    const { data: { hostList } } = await query(
      ModelHostDao.find({
        // where:
        fields: [
          'id',
          'host',
          `endpointRelation {
            endpoint {
              id
              alias
            }
          }`
        ],
        alias: 'hostList'
      })
    )
    const treeData = hostList.map(host => ({
      title: host.host,
      key: host.id,
      children: host.endpointRelation
        .filter(({ endpoint }) => !!endpoint)
        .map(({ endpoint }) => ({
          title: endpoint.alias,
          key: endpoint.id
        }))
    }))
    return treeData
  }

  // FIXME: host 与 endpoint 并非一定是树形结构
  // TODO: 字段有待确认
  static async cmdbTree () {
    const { data: { hostList } } = await query(
      CmdbHostDao.find({
        // where:
        fields: [
          'id',
          'alias',
          `endpointRelation {
            endpoint {
              endpoint_id
              alias
            }
          }`
        ],
        alias: 'hostList'
      })
    )
    const treeData = hostList.map(host => ({
      title: host.host,
      key: host.id,
      children: host.endpointRelation
        .filter(({ endpoint }) => !!endpoint)
        .map(({ endpoint }) => ({
          title: endpoint.alias,
          key: endpoint.id
        }))
    }))
    return treeData
  }

  static async hostTypeFind (argus = {}) {
    return query(
      CmdbHostGroupByHostTypeDao.find(argus)
    )
  }

  static async hostFind (argus = {}) {
    return query(
      CmdbHostDao.find(argus)
    )
  }

  static async endpointFind (argus = {}) {
    return query(
      CmdbHostEndpointDao.find(argus)
    )
  }

  static async metricFind (argus = {}) {
    return query(
      CmdbEndpointMetricDao.find(argus)
    )
  }

  static async latestMetric ({ host_id, endpoint_id, metric_id }) {
    const { data: { metricList } } = await query(
      MetricDao.find({
        where: { host_id, endpoint_id, metric_id },
        fields: [
          `metric_value
          metric_value_str
          upload_time
          host {
            alias
          }
          endpoint {
            modelEndpoint {
              alias
            }
          }
          metric {
            modelMetric {
              alias
            }
          }`
        ],
        limit: 1,
        alias: 'metricList'
      })
    )
    console.log(metricList)
  }
}

export {
  CmdbService
}
