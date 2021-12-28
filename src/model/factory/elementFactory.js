/**
* 元素工厂
* Author: dong xing
* Date: 2019/11/19
* Time: 5:36 下午
* Email: dong.xing@outlook.com
*/
import AlarmListElement from '../element/AlarmListElement'
import ListElement from '../element/ListElement'
import UpsElement from '@/model/element/UpsElement'
import SelectElement from '@/model/element/SelectElement'
import MoreElement from '@/model/element/MoreElement'
import TabElement from '@/model/element/TabElement'
import NewAlarmElement from '@/model/element/NewAlarmElement'

export default class ElementFactory {
  static create (type, { widget, element, onlyShow = false }) {
    switch (type) {
      case 'AlarmList':
        return new AlarmListElement({ widget, element, onlyShow })
      case 'List':
        return new ListElement({ widget, element, onlyShow })
      case 'NewAlarm':
        return new NewAlarmElement({ widget, element, onlyShow })
      case 'UPS':
        return new UpsElement({ widget, element, onlyShow })
      case 'Select':
        return new SelectElement({ widget, element, onlyShow })
      case 'More':
        return new MoreElement({ widget, element, onlyShow })
      case 'Tab':
        return new TabElement({ widget, element, onlyShow })
      default:
        return null
    }
  }
}
