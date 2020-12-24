import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import {
  CmdbHostDao,
  CmdbEndpointMetricDao,
  CmdbHostEndpointDao,
  CmdbHostEndpointMetricDao
} from '../dao/index'
import _ from 'lodash'

class CmdbService extends BaseService {
  static async tree () {
    const { data: { hostList } } = await query(
      CmdbHostDao.find({
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
    // 扁平一层查找
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

    // FIXME: host_type 为 Linux 时 hasura 查询处重复数据，此处为前端 hack
    cmdbHostList = _.uniqBy(cmdbHostList, el => el.id)

    // 树形结构构建
    const root = {
      id: 'root',
      alias: '数据中心',
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
          .map(([host_type, list]) => ({
            // 统一个 model_host 会在不同 location 中多次用到
            // 此处 id 仅用作树形结构唯一标识，并无实际作用
            id: `${location}-${host_type}`,
            alias: _.get(list, ['0', 'modelHost', 'host']) || host_type,
            children: list,
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

  static async endpointList (id) {
    if (!id) {
      return []
    }

    const { data: { cmdbHostList } } = await query(
      CmdbHostDao.find({
        where: { id },
        fields: [
          `endpointList: endpointRelation {
            key: endpoint_id
            endpoint {
              label: alias
            }
          }`
        ],
        alias: 'cmdbHostList'
      })
    )

    const endpointList = _.get(cmdbHostList, '[0].endpointList', [])

    return endpointList.map(e => ({
      key: e.key,
      label: _.get(e, 'endpoint.label', e.key)
    }))
  }

  static async metricList (endpoint_id) {
    if (!endpoint_id) {
      return []
    }

    const { data: { cmdbEndpointMetricList } } = await query(
      CmdbEndpointMetricDao.find({
        where: { endpoint_id },
        fields: [
          `metric {
            key: metric_id
            modelMetric {
              label: alias
            }
          }`
        ],
        alias: 'cmdbEndpointMetricList'
      })
    )

    const metricList = cmdbEndpointMetricList.map(({ metric }) => metric)
    return metricList.map(e => ({
      key: e.key,
      label: _.get(e, 'modelMetric.label', e.key)
    }))
  }

  static async flatInfoByHostId (host_id) {
    const { data: { dataSource } } = await query(
      CmdbHostEndpointMetricDao.find({
        where: { host_id },
        fields: [
          'deviceType: type_model_value_code',
          'deviceModel: device_model_value_code',
          'deviceModelName: device_model_name',
          'deviceBrand: brand_value_code',
          'hostType: host_type',
          'hostId: host_id',
          'hostAlias: host_alias'
        ],
        limit: 1,
        alias: 'dataSource'
      })
    )

    const [{ hostType, hostAlias, ...host }] = dataSource
    // hack
    if (['h3cSwitch', 'h3cDevice', 'huaweiSwitch'].includes(hostType)) {
      host['deviceModelName'] = 'Switch'
    } else if (['ciscoRouter', 'h3cRouter'].includes(hostType)) {
      host['deviceModelName'] = 'Router'
    } else if (hostAlias.includes('防火墙')) {
      host['deviceModelName'] = 'Firewall'
    }
    return host
  }
}

export {
  CmdbService
}
