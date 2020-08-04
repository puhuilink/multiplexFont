/**
* 元素部件集
* Author: dong xing
* Date: 2020/3/26
* Time: 12:49
* Email: dong.xing@outlook.com
*/

import ListElement from './ListElement.vue'
import LatestAlarmElement from './LatestAlarmElement'

const ELEMENT_MAPPING = new Map([
  ['AlarmList', 'LatestAlarmElement'],
  ['List', 'ListElement']
])

const ELEMENTS = {
  LatestAlarmElement,
  ListElement
}

export {
  ELEMENTS,
  ELEMENT_MAPPING
}
