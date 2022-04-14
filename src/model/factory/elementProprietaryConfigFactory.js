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
import TimeSelectProprietaryConfig from '@/model/config/proprietaryConfigs/TimeSelectProprietaryConfig'
import SDMapProprietaryConfig from '@/model/config/proprietaryConfigs/SDMapProprietaryConfig'
import PercentProprietaryConfig from '@/model/config/proprietaryConfigs/PercentProprietaryConfig'
import ToLineProprietaryConfig from '@/model/config/proprietaryConfigs/ToLineProprietaryConfig'

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
      case 'TimeSelector':
        return new TimeSelectProprietaryConfig(proprietaryConfig)
      case 'SDMap':
        return new SDMapProprietaryConfig(proprietaryConfig)
      case 'ToLine':
        return new ToLineProprietaryConfig(proprietaryConfig)
      case 'Percent':
        return new PercentProprietaryConfig(proprietaryConfig)
      default:
        return null
    }
  }
}
