import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
import _ from 'lodash'
import {
  ModelHostDao,
  ModelHostEndpointDao,
  ModelEndpointMetricDao,
  ModelHostGroupByModelDao,
  ModelHostGroupByHostTypeDao
} from '../dao'
class ModelService extends BaseService {
  // FIXME: host 与 endpoint 并非一定是树形结构
  static async tree () {
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

  /**
   * 查询所有 host 模型的 host_type
   */
  static async modelHostTypeList () {
    const { data: { modelHostTypeList } } = await query(
      ModelHostGroupByHostTypeDao.find({
        fields: [
          'key: id',
          'host',
          'host_type'
        ],
        alias: 'modelHostTypeList'
      })
    )
    return modelHostTypeList.map(el => ({
      ...el,
      label: el['host'] || el['host_type']
    }))
  }

  /**
   * 查询 host 模型下的 endpoint 列表
   * @param {Number} modelHostId t_model_host.host_id
   */
  static async modelEndpointList (value) {
    const { data: { modelHostEndpointList } } = await query(
      // FIXME: hack
      ModelHostEndpointDao.find({
        where: {
          ...typeof value === 'string' ? {
            host: {
              host_type: {
                _eq: value
              }
            }
          } : {
            host_id: value
          }
          // host_id: modelHostId
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

    const validList = modelHostEndpointList
      .filter(({ endpoint }) => endpoint && endpoint.id)
      .map(({ endpoint }) => ({
        key: endpoint.id,
        label: endpoint.alias
      }))
    const uniqList = _.uniq(validList, ({ key }) => key)
    return uniqList
  }

  /**
   * 查询 endpoint 模型下的 metric 列表
   * @param {Number} endpointModel t_model_endpoint.endpoint_id
   */
  static async modelMetricList (endpointModel) {
    const { data: { modelEndpointMetricList } } = await query(
      ModelEndpointMetricDao.find({
        where: {
          endpoint_id: endpointModel
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

  static async hostFind (argus = {}) {
    return query(
      ModelHostDao.find(argus)
    )
  }

  static async groupByModelFind (argus = {}) {
    return query(
      ModelHostGroupByModelDao.find(argus)
    )
  }
}

export {
  ModelService
}
