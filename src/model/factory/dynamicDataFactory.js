/**
 * 动态数据工厂
 */

import _ from 'lodash'

import GaugeDataConfig from '../config/dataConfig/dynamicData/GaugeDataConfig'
import BarDataConfig from '../config/dataConfig/dynamicData/BarDataConfig'
import DegreeDataConfig from '../config/dataConfig/dynamicData/DegreeRingDataConfig'
import AlarmListDataConfig from '../config/dataConfig/dynamicData/AlarmListDataConfig'
import LinesDataConfig from '../config/dataConfig/dynamicData/LinesDataConfig'
import TextHealthDataConfig from '../config/dataConfig/dynamicData/TextHealthDataConfig'
import ListDataConfig from '../config/dataConfig/dynamicData/ListDataConfig'
import PieDataConfig from '../config/dataConfig/dynamicData/PieDataConfig'
import PolarDataConfig from '../config/dataConfig/dynamicData/PolarDataConfig'

export default class DynamicDataFactory {
  static create (type, dbDataConfig) {
    switch (_.upperFirst(type)) {
      case 'Gauge':
        return new GaugeDataConfig(dbDataConfig)
      case 'Bar':
        return new BarDataConfig(dbDataConfig)
      case 'AlarmList':
        return new AlarmListDataConfig(dbDataConfig)
      case 'Lines':
        return new LinesDataConfig(dbDataConfig)
      case 'View':
        return
      case 'DegreeRing':
        return new DegreeDataConfig(dbDataConfig)
      case 'TextHealth':
        return new TextHealthDataConfig(dbDataConfig)
      case 'List':
        return new ListDataConfig(dbDataConfig)
      case 'Pie':
        return new PieDataConfig(dbDataConfig)
      case 'Polar':
        return new PolarDataConfig(dbDataConfig)
      default:
        // console.log('unknown dbDataConfig type', type)
        // throw new Error('unknown type')
    }
  }
}
