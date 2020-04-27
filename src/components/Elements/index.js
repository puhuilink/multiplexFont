/**
* 元素部件集
* Author: dong xing
* Date: 2020/3/26
* Time: 12:49
* Email: dong.xing@outlook.com
*/

import AlarmListElement from './AlarmListElement'
import ListElement from './ListElement.vue'

const ELEMENTMAPPING = new Map([
  ['AlarmList', 'AlarmListElement'],
  ['List', 'ListElement']
])

const ELEMENTS = {
  AlarmListElement,
  ListElement
}

export {
  ELEMENTS,
  ELEMENTMAPPING
}
