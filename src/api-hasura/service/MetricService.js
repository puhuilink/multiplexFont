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
  static async chartValue ({ resourceConfig, timeRange, ...argus }) {
    console.log(arguments)
    const mockData = {
      host_id: 263146573824,
      endpoint_id: 806724177920,
      metric_id: 806724177920,
      host_alias: '丝路驿站服务器',
      endpoint_alias: 'CPU',
      metric_alias: 'CPU使用率',
      metric_tags: 'CPU usage',
      metric_value: 80,
      metric_value_str: '',
      collect_time: '2020-07-29 16:56:50.676'
    }
    const barData = [
      {
        ...mockData
      },
      { ...mockData,
        metric_value: 20,
        host_alias: '厦门机房服务器'
      },
      { ...mockData,
        metric_value: 50,
        metric_alias: 'CPU健康度'
      },
      { ...mockData,
        host_alias: '厦门机房服务器',
        metric_alias: 'CPU健康度'
      }
    ]
    const lineData = [
      { ...mockData },
      {
        ...mockData,
        metric_value: 70,
        collect_time: '2020-07-27 16:56:50.676'
      },
      {
        ...mockData,
        metric_value: 90,
        collect_time: '2020-07-25 16:56:50.676'
      },
      {
        ...mockData,
        metric_value: 20,
        host_alias: '厦门机房服务器',
        collect_time: '2020-07-29 16:56:50.676'
      },
      {
        ...mockData,
        metric_value: 30,
        host_alias: '厦门机房服务器',
        collect_time: '2020-07-26 16:56:50.676'
      },
      {
        ...mockData,
        metric_value: 25,
        host_alias: '厦门机房服务器',
        collect_time: '2020-07-25 16:56:50.676'
      }
    ]
    return barData
  }

  // ------------------
  static async todo ({ resourceConfig, timeRange = {}, ...argus }) {
    const data = _.pick(resourceConfig, ['hostIds', 'endpointModel', 'metricModels', 'modelHostId'])

    // 时间范围
    if (!_.isEmpty(timeRange)) {
      Object.assign(data, _.pick(timeRange, ['startTime', 'endTime']))
    }
    return axios.post({

    })
  }
}

export {
  MetricService
}
