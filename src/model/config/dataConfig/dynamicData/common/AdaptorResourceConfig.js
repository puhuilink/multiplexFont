/**
 * 动态数据配置中间层
 * 用于字段映射与调整，解耦功能代码与业务代码
 */

import _ from 'lodash'

export class AdaptorResourceConfig {
  static fieldsMapping = new Map([
    ['metric_value', 'valueNum'],
    ['metric_value_str', 'valueStr'],
    ['collect_time', 'time'],
    ['host_id', 'hostId'],
    ['endpoint_id', 'endpointId'],
    ['metric_id', 'metricId'],
    ['host_alias', 'hostAlias'],
    ['endpoint_alias', 'endpointAlias'],
    ['metric_alias', 'metricAlias'],
    ['metric_tag', 'metricTag']
  ])

  constructor ({
    deviceType = 'Host',
    deviceBrand = 'HostLinux',
    deviceModel = 'HostAIXLinux',
    hostId = [],
    endpointModelId = 1149375446,
    metricModelIds = [],
    // enum: day / hour / minute
    isGroup = '',
    // enum: total / max / average
    calculateType = ''
  }) {
    this.deviceType = deviceType
    this.deviceBrand = deviceBrand
    this.deviceModel = deviceModel
    this.hostId = hostId
    this.endpointModelId = endpointModelId
    this.metricModelIds = metricModelIds
    this.isGroup = isGroup
    this.calculateType = calculateType
  }

  static transfer (dataList = []) {
    // console.log(dataList)
    const { fieldsMapping } = AdaptorResourceConfig
    const result = []
    dataList.forEach(data => {
      // pick keys
      const expectedData = _.pick(data, [...fieldsMapping.keys()])
      if (_.isEmpty(expectedData)) {
        return
      }

      // transfer keys
      const {
        hostAlias = '', endpointAlias = '', metricAlias = '', metricTag = '',
        valueNum = 0, valueStr = '',
        time
        // ...rest
      } = _.mapKeys(expectedData, (value, key) => fieldsMapping.get(key))

      // transfer values
      result.push({
        legend: hostAlias,
        category: `${endpointAlias}-${metricAlias || metricTag}`,
        value: valueStr || valueNum,
        time
        // ...rest
      })
    })
    return result
  }

  getOption () {
    return {
      ...this
    }
  }
}
