/**
 * 动态数据工厂
 */

import GaugeDataConfig from '../config/dataConfig/dynamicData/GaugeDataConfig'
import _ from 'lodash'

export default class DynamicDataFactory {
  static create (type, dbDataConfig) {
    switch (_.upperFirst(type)) {
      case 'Gauge':
        return new GaugeDataConfig(dbDataConfig)
      case 'View':
        return
      default:
        console.log(type)
        // throw new Error('unknown type')
    }
  }
}
