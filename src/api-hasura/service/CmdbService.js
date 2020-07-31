import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
// eslint-disable-next-line no-unused-vars
import {
  ModelHostDao, ModelHostEndpointDao, ModelEndpointMetricDao, ModelHostGroupByHostTypeDao,
  CmdbHostDao, CmdbEndpointMetricDao, CmdbHostEndpointDao, CmdbHostGroupByHostTypeDao,
  MetricDao
} from '../dao'
// TODO: Adaptor Dao
// TODO: No GraphQL API + Adaptor Dao
import _ from 'lodash'

// TODO: t_metric 表以外可能可以用 GraphQL 缓存
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

  // TODO: pg 视图？
  static async latestMetric ({ hostId, endpointId, metricId }) {
    const { data } = await query(
      MetricDao.find({
        where: {
          host_id: hostId,
          endpoint_id: endpointId,
          metric_id: metricId
        },
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
        alias: 'data'
      })
    )
    return data
  }

  // --------------- divided ---------------

  static async _modelHostTypeById (modelHostId) {
    const { data: { hostGroupByHostTypeList } } = await query(
      ModelHostGroupByHostTypeDao.find({
        where: {
          id: modelHostId
        },
        fields: ['host_type'],
        alias: 'hostGroupByHostTypeList'
      })
    )
    const host_type = _.get(hostGroupByHostTypeList, '[0].host_type')
    return host_type
  }

  static async cmdbHostList (modelHostId) {
    const host_type = this._modelHostTypeById(modelHostId)
    const { data: { cmdbHostList } } = await query(
      CmdbHostDao.find({
        where: {
          host_type
          // enable: true
        },
        fields: [
          'key: id',
          'label: alias'
        ],
        alias: 'cmdbHostList'
      })
    )
    const validList = cmdbHostList.filter(({ key }) => !!key)
    const uniqList = _.uniq(validList, ({ key }) => key)
    return uniqList
  }

  static async modelHostTypeList () {
    const { data: { modelHostTypeList } } = await query(
      ModelHostGroupByHostTypeDao.find({
        fields: [
          'key: id',
          'label: host_type'
        ],
        alias: 'modelHostTypeList'
      })
    )
    return modelHostTypeList
  }

  static async modelEndpointList (modelHostId) {
    const { data: { modelHostEndpointList } } = await query(
      ModelHostEndpointDao.find({
        where: {
          host_id: modelHostId
          // enable: true
        },
        fields: [
          `endpoint {
            id
            alias
          }`
        ],
        alias: 'modelHostEndpointList'
      })
    )

    console.log(modelHostEndpointList)

    const validList = modelHostEndpointList
      .filter(({ endpoint }) => endpoint && endpoint.id)
      .map(({ endpoint }) => ({
        key: endpoint.id,
        label: endpoint.alias
      }))
    const uniqList = _.uniq(validList, ({ key }) => key)
    console.log(uniqList)
    return uniqList
  }

  static async modelMetricList (modelEndpointId) {
    const { data: { modelEndpointMetricList } } = await query(
      ModelEndpointMetricDao.find({
        where: {
          endpoint_id: modelEndpointId
          // enable: true
        },
        fields: [
          `metric {
            id
            alias
          }`
        ],
        alias: 'modelEndpointMetricList'
      })
    )
    const validList = modelEndpointMetricList
      .filter(({ metric }) => metric && metric.id)
      .map(({ metric }) => ({
        key: metric.id,
        label: metric.alias
      }))
    const uniqList = _.uniq(validList, ({ key }) => key)
    return uniqList
  }
}

export {
  CmdbService
}
