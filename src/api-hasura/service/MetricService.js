/* eslint-disable no-unused-vars */
import { BaseService } from './BaseService'
import { CmdbHostEndpointMetricService } from './CmdbHostEndpointMetricService'
import { query } from '../utils/hasura-orm/index'
import { MetricDao } from '../dao'
import _ from 'lodash'
import { generateQuery } from '@/utils/graphql'

class MetricService extends BaseService {
  static _idFieldList = ['host_id', 'endpoint_id', 'metric_id']
  static _aliasFieldList = ['host_alias', 'endpoint_alias', 'metric_alias', 'metric_tags']
  static _valueFieldList = ['metric_value', 'metric_value_str', 'collect_time']

  static async find (argus = {}) {
    const { data: { metricList } } = await query(
      MetricDao.find({
        fields: [
          ...this._idFieldList,
          ...this._valueFieldList
        ],
        ...argus,
        alias: 'metricList'
      })
    )
    return metricList
  }

  /**
   * 视图组件指标查询
   */
  static async chartValue ({ resourceConfig, timeRange, ...argus }) {
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
    return [
      { ...mockData },
      {
        ...mockData,
        metric_value: 70,
        collect_time: '2020-07-27 16:56:50.676'
      },
      {
        ...mockData,
        metric_value: 90,
        collect_time: '2020-07-26 16:56:50.676'
      }
    ]
    // 组合参数为 graphql 参数形式
    // const list = this._compose(resourceConfig)
    // console.log(resourceConfig, list)
    // if (_.isEmpty(list)) return []

    // // 查询 alias 等基本信息
    // const cmdbHostEndpointMetricList = await CmdbHostEndpointMetricService.find({
    //   where: {
    //     _or: list.map(el => generateQuery(el))
    //   }
    // })
    // if (_.isEmpty(cmdbHostEndpointMetricList)) return []
    // const aliasMapping = new Map(cmdbHostEndpointMetricList.map(el => {
    //   const key = this._generateAliasMappingKey(el)
    //   const value = _.pick(el, this._valueFieldList)
    //   return [key, value]
    // }))

    // // 查询指标
    // const metricList = await this.find({
    //   where: {
    //     _or: cmdbHostEndpointMetricList.map(el => generateQuery(_.pick(el, this._idFieldList)))
    //     // generate(timeRange)
    //   },
    //   // ..argus
    //   limit: 1
    // })
    // if (_.isEmpty(metricList)) return []

    // // 指标拼接 alias
    // return metricList.map(metric => {
    //   const key = this._generateAliasMappingKey(metric)
    //   const alias = aliasMapping.get(key) || {}
    //   return {
    //     ...alias,
    //     ...metric
    //   }
    // })
  }

  /**
   * 组合视图组件指标查询参数为一维数组
   * @returns {Array<{ host_id, metric_model_id, endpoint_model_id }>}
   */
  static _compose ({
    cmdbHostIdList = [],
    modelEndpointId = null,
    modelMetricIdList = []
  }) {
    if (
      _.isEmpty(cmdbHostIdList) ||
      _.isEmpty(modelMetricIdList) ||
      !modelEndpointId
    ) return []

    const result = []
    cmdbHostIdList.forEach(cmdbHostId => {
      modelMetricIdList.forEach(modelMetricId => {
        result.push({
          host_id: cmdbHostId,
          metric_model_id: modelMetricId,
          endpoint_model_id: modelEndpointId
        })
      })
    })
    return result
  }

  static _generateAliasMappingKey ({ host_id, endpoint_id, metric_id }) {
    return `${host_id}-${endpoint_id}-${metric_id}`
  }
}

export {
  MetricService
}
