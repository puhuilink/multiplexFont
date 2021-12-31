/**
* 元素专有属性工厂
* Author: dong xing
* Date: 2020/4/7
* Time: 11:00
* Email: dong.xing@outlook.com
*/

import AlarmListProprietaryConfig from '../config/proprietaryConfigs/AlarmListProprietaryConfig'
import ListProprietaryConfig from '../config/proprietaryConfigs/ListProprietaryConfig'
import UpsProprietaryConfig from '@/model/config/proprietaryConfigs/UpsProprietaryConfig'
import MoreProprietaryConfig from '@/model/config/proprietaryConfigs/MoreProprietaryConfig'
import TabProprietaryConfig from '@/model/config/proprietaryConfigs/TabProprietaryConfig'
import SelectProprietaryConfig from '@/model/config/proprietaryConfigs/SelectProprietaryConfig'

export default class ElementProprietaryConfigFactory {
  static create ({ type, proprietaryConfig = {} }) {
    switch (type) {
      case 'AlarmList':
        return new AlarmListProprietaryConfig(proprietaryConfig)
      case 'List':
        return new ListProprietaryConfig(proprietaryConfig)
      case 'NewAlarm':
        return new ListProprietaryConfig(proprietaryConfig)
      case 'UPS':
        return new UpsProprietaryConfig(proprietaryConfig)
      case 'Select':
        return new SelectProprietaryConfig(proprietaryConfig)
      case 'More':
        return new MoreProprietaryConfig(proprietaryConfig)
      case 'Tab':
        return new TabProprietaryConfig(proprietaryConfig)
      default:
        return null
    }
  }
}
