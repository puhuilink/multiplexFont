import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
// eslint-disable-next-line no-unused-vars
import { ModelHostDao, CmdbHostDao } from '../dao'

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

  static async hostFind (argus = {}) {
    return query(
      CmdbHostDao.find(argus)
    )
  }
}

export {
  CmdbService
}
