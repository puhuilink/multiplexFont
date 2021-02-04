import { BaseService } from './BaseService'
import { CmdbHostEndpointMetricService } from './CmdbHostEndpointMetricService'
import { query } from '../utils/hasura-orm/index'
import { MetricDao } from '../dao/index'
import _ from 'lodash'

class MetricService extends BaseService {
  static async find ({ orderBy = { collect_time: 'desc' }, ...argus }) {
    return query(
      MetricDao.find({
        orderBy,
        ...argus
      })
    )
  }

  static async batchFind (argus) {
    return query(
      ...argus.map(e => MetricDao.find(e))
    )
  }

  static async aggregateFind ({ host_id, ...argus }) {
    const { data: { configList, pagination } } = await CmdbHostEndpointMetricService.find({
      where: { host_id },
      fields: [
        'host_id',
        'endpoint_id',
        'metric_id',
        'host_alias',
        'endpoint_alias',
        'metric_alias',
        'metric_unit: metric_uint',
        `metricList(limit: 1) {
          metric_value
          metric_value_str
          collect_time
          metric {
            alias
            modelMetric {
              alias
            }
          }
        }`
      ],
      ...argus,
      alias: 'configList'
    })

    // 一个 endpoint 模型可能对应多个实例
    // 如 磁盘 => 磁盘/dev 磁盘/etc
    const orderByEndpointAlias = _.orderBy(configList, ['endpoint_alias'], ['asc'])
    const groupByEndpointAlias = _.groupBy(orderByEndpointAlias, 'endpoint_alias')
    const data = Object
      .entries(groupByEndpointAlias)
      .map(([key, value]) => ({
        endpoint_alias: key,
        children: value.map(({ metricList, ...rest }) => ({
          ...metricList[0] || {},
          ...rest
        }))
      }))
    return { data, pagination }
  }
}

export {
  MetricService
}
