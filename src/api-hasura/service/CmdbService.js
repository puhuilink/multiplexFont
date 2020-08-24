import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
import {
  CmdbHostDao,
  CmdbEndpointMetricDao,
  CmdbHostEndpointDao,
  ModelHostGroupByHostTypeDao
} from '../dao'
// import _ from 'lodash'
const _ = require('lodash')

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

  static async resourceTree (where = {}) {
    // 一维数组查找
    let { data: { cmdbHostList } } = await query(
      CmdbHostDao.find({
        where: {
          ...where,
          enable: true
        },
        fields: [
          'id',
          'alias',
          'location',
          'host',
          'host_type',
          'modelHost { host }'
        ],
        alias: 'cmdbHostList'
      })
    )

    // host_type 汉化
    cmdbHostList = cmdbHostList.map(({ modelHost = {}, host_type = '', ...rest }) => ({
      ...rest,
      host_type: modelHost.host || host_type
    }))

    // 树形结构构建
    const root = {
      id: 'root',
      alias: '根节点',
      children: [],
      type: 'root',
      selectable: false
    }

    // 按采集系统 / 区域划分第一层
    const locationList = _.groupBy(cmdbHostList.filter(Boolean), 'location')

    // 按设备类型划分第二层
    Object
      .entries(locationList)
      .forEach(([location, hostList]) => {
        const children = Object
          .entries(_.groupBy(hostList, 'host_type'))
          .map(([hostType, hostList]) => ({
            id: hostType,
            alias: hostType,
            children: hostList,
            type: 'hostType',
            selectable: false
          }))
        root.children.push({
          id: location,
          alias: location,
          type: 'location',
          children: children,
          selectable: false
        })
      })

    return [root]
  }

  static async cmdbHostList (host_type) {
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
