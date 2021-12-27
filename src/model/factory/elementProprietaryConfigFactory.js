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
import SelectProprietaryConfig from '@/model/config/proprietaryConfigs/SelectProprietaryConfig'

export default class ElementProprietaryConfigFactory {
  static create ({ type, proprietaryConfig = {} }) {
    switch (type) {
      case 'AlarmList':
        return new AlarmListProprietaryConfig(proprietaryConfig)
      case 'List':
        return new ListProprietaryConfig(proprietaryConfig)
      case 'UPS':
        return new UpsProprietaryConfig(proprietaryConfig)
      case 'Select':
        return new SelectProprietaryConfig(proprietaryConfig)
      default:
        return null
    }
  }
}
