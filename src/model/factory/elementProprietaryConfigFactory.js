/**
* 元素专有属性工厂
* Author: dong xing
* Date: 2020/4/7
* Time: 11:00
* Email: dong.xing@outlook.com
*/

import AlarmListProprietaryConfig from '../config/proprietaryConfigs/AlarmListProprietaryConfig'

export default class ElementProprietaryConfigFactory {
  static create ({ type, proprietaryConfig = {} }) {
    switch (type) {
      case 'AlarmList':
        return new AlarmListProprietaryConfig(proprietaryConfig)
      default:
        return null
    }
  }
}
