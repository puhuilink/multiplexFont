/**
* 静态数据工厂
* Author: dong xing
* Date: 2019/11/20
* Time: 5:13 下午
* Email: dong.xing@outlook.com
*/
import LinesStaticDataConfig from '../config/dataConfig/staticDataConfig/LinesStaticDataConfig'
import BarStaticDataConfig from '../config/dataConfig/staticDataConfig/BarStaticDataConfig'
import PieStaticDataConfig from '../config/dataConfig/staticDataConfig/PieStaticDataConfig'
import GaugeStaticDataConfig from '../config/dataConfig/staticDataConfig/GaugeStaticDataConfig'
import DegreeRingStaticDataConfig from '../config/dataConfig/staticDataConfig/DegreeRingStaticDataConfig'
import TextHealthStaticDataConfig from '../config/dataConfig/staticDataConfig/TextHealthStaticDataConfig'
import PolarStaticDataConfig from '../config/dataConfig/staticDataConfig/PolarStaticDataConfig'
import ListElementStaticDataConfig from '../config/dataConfig/staticDataConfig/ListElementStaticDataConfig'

export default class StaticDataConfigFactory {
  static create (type, staticDataConfig = {}) {
    switch (type) {
      case 'Lines':
        return new LinesStaticDataConfig(staticDataConfig)
      case 'Bar':
        return new BarStaticDataConfig(staticDataConfig)
      case 'Pie':
        return new PieStaticDataConfig(staticDataConfig)
      case 'Gauge':
        return new GaugeStaticDataConfig(staticDataConfig)
      case 'DegreeRing':
        return new DegreeRingStaticDataConfig(staticDataConfig)
      case 'TextHealth':
        return new TextHealthStaticDataConfig(staticDataConfig)
      case 'Polar':
        return new PolarStaticDataConfig(staticDataConfig)
      case 'List':
        return new ListElementStaticDataConfig(staticDataConfig || {})
      default:
        // console.log('unknown staticDataConfig type: ' + type)
        return null
    }
  }
}
