/**
 * 动态数据配置中间层
 * 转换 cmdb 到 echarts 数据格式
 */

import _ from 'lodash'
import { MetricService } from '@/api-hasura'

export class AdaptorDataConfig {
  static fieldsMapping = new Map([
    ['metric_value', 'valueNum'],
    ['metric_value_str', 'valueStr'],
    ['collect_time', 'time']
  ])

  static transfer (dataList = []) {
    const { fieldsMapping } = AdaptorDataConfig
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
      .then(AdaptorDataConfig.transfer)
      .catch(err => {
        console.error(err)
        return []
      })
  }
}
