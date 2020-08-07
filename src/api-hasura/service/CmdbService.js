import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
import {
  CmdbHostDao,
  CmdbEndpointMetricDao,
  CmdbHostEndpointDao,
  ModelHostGroupByHostTypeDao
} from '../dao'
// TODO: Adaptor Dao
// TODO: No GraphQL API + Adaptor Dao
import _ from 'lodash'

// TODO: t_metric 表以外可能可以用 GraphQL 缓存
class CmdbService extends BaseService {
  // FIXME: host 与 endpoint 并非一定是树形结构
  // TODO: 字段有待确认
  static async tree () {
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

  // static async hostTypeFind (argus = {}) {
  //   return query(
  //     CmdbHostGroupByHostTypeDao.find(argus)
  //   )
  // }
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
    const host_type = await this._modelHostTypeById(modelHostId)
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
}

export {
  CmdbService
}
