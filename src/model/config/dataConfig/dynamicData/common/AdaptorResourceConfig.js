/**
 * 动态数据配置中间层
 * 用于字段映射与调整，解耦功能代码与业务代码
 */

import _ from 'lodash'
import { MetricService } from '@/api-hasura'

export class AdaptorResourceConfig {
  static fieldsMapping = new Map([
    ['metric_value', 'valueNum'],
    ['metric_value_str', 'valueStr'],
    ['collect_time', 'time']
  ])

  constructor ({
    // cmdbHostIdList = [],
    // modelEndpointId = null,
    // modelMetricIdList = [],
    // modelHostId = null
    // mock
    cmdbHostIdList = [257882722304],
    modelEndpointId = 1988235274,
    modelMetricIdList = [1988235275],
    modelHostId = 1988235264
  }) {
    this.cmdbHostIdList = cmdbHostIdList
    this.modelEndpointId = modelEndpointId
    this.modelMetricIdList = modelMetricIdList
    this.modelHostId = modelHostId
  }

  static transfer (dataList = []) {
    const { fieldsMapping } = AdaptorResourceConfig
    const result = []
    dataList.forEach(data => {
      // pick keys
      const expectedData = _.pick(data, [...fieldsMapping.keys()])
      if (_.isEmpty(expectedData)) {
        return
      }

      // transfer keys
      const { valueNum, valueStr, ...rest } = _.mapKeys(expectedData, (value, key) => fieldsMapping.get(key))

      // transfer values
      result.push({
        value: valueStr || valueNum || '',
        ...rest
      })
    })
    return result
  }

  static fetch (config = {}) {
    return MetricService
      .chartValue({
        ...config,
        orderBy: { collect_time: 'desc' }
      })
      .then(AdaptorResourceConfig.transfer)
      .catch(err => {
        console.error(err)
        return []
      })
  }
}
