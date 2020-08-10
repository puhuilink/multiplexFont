/**
 * cmdb 数据与 echarts 数据中间层
 */

import _ from 'lodash'

export default class Adaptor {
  static fieldsMapping = new Map([
    ['metric_value', 'valueNum'],
    ['metric_value_str', 'valueStr'],
    ['collect_time', 'time']
  ])

  static transfer (dataList = []) {
    const { fieldsMapping } = Adaptor
    const result = []
    dataList.forEach(data => {
      const expectedData = _.pick(data, [...fieldsMapping.keys()])
      if (_.isEmpty(expectedData)) {
        return
      }
      // transfer keys
      const { valueNum, valueStr, ...rest } = _.mapKeys(expectedData, (value, key) => fieldsMapping.get(key))

      // transfer value
      result.push({
        value: valueStr || valueNum || '',
        ...rest
      })
    })
    return result
  }
}
