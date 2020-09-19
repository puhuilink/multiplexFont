/* eslint-disable no-unused-vars */
import { BaseService } from './BaseService'
import { CmdbHostEndpointMetricService } from './CmdbHostEndpointMetricService'
import { query } from '../utils/hasura-orm/index'
import { MetricDao } from '../dao'
import _ from 'lodash'
import { generateQuery } from '@/utils/graphql'
import { axios } from '@/utils/request'

class MetricService extends BaseService {
  static async find ({ orderBy = { collect_time: 'desc' }, ...argus }) {
    const res = await query(
      MetricDao.find({
        orderBy,
        ...argus
      })
    )
    return res
  }

  /**
   * 视图组件指标查询
   */
  static async chartValue ({ resourceConfig, timeRange = {}, ...argus }) {
    // 监控设备
    const data = _.pick(resourceConfig, [
      'deviceType',
      'deviceBrand',
      'deviceModel',
      'hostId',
      'endpointModelId',
      'metricModelIds',
      'isGroup',
      'calculateType'
    ])

    // 时间范围
    if (!_.isEmpty(timeRange)) {
      Object.assign(data, _.pick(timeRange, ['startTime', 'endTime']))
    }
    console.log(data)
    return axios.post('/view/data', data)
  }
}

export {
  MetricService
}
