/**
* 元素工厂
* Author: dong xing
* Date: 2019/11/19
* Time: 5:36 下午
* Email: dong.xing@outlook.com
*/
import AlarmListElement from '../element/AlarmListElement'
import ListElement from '../element/ListElement'

export default class ElementFactory {
  static create (type, widget) {
    switch (type) {
      case 'AlarmList':
        return new AlarmListElement(widget)
      case 'List':
        return new ListElement(widget)
      default:
        return null
    }
  }
}
