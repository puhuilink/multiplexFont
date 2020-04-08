/**
 * 动态数据工厂
 */

import GaugeDataConfig from '../config/dataConfig/dynamicData/GaugeDataConfig'
import BarDataConfig from '../config/dataConfig/dynamicData/BarDataConfig'
import _ from 'lodash'

export default class DynamicDataFactory {
  static create (type, dbDataConfig) {
    switch (_.upperFirst(type)) {
      case 'Gauge':
        return new GaugeDataConfig(dbDataConfig)
      case 'Bar':
        return new BarDataConfig(dbDataConfig)
      case 'View':
        return
      default:
        console.log('unknown dbDataConfig type', type)
        // throw new Error('unknown type')
    }
  }
}
