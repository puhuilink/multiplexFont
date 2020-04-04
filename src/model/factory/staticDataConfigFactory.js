/**
* 静态数据工厂
* Author: dong xing
* Date: 2019/11/20
* Time: 5:13 下午
* Email: dong.xing@outlook.com
*/
import LinesStaticDataConfig from '../config/dataConfig/staticDataConfig/LinesStaticDataConfig'
import BarStaticDataConfig from '../config/dataConfig/staticDataConfig/BarStaticDataConfig'

export default class StaticDataConfigFactory {
  static create (type) {
    switch (type) {
      case 'Lines':
        return LinesStaticDataConfig
      case 'Bar':
        return BarStaticDataConfig
      default:
        return null
    }
  }
}
