/**
* 元素部件集
* Author: dong xing
* Date: 2020/3/26
* Time: 12:49
* Email: dong.xing@outlook.com
*/

import ListElement from './ListElement.vue'
import LatestAlarmElement from './LatestAlarmElement'
import UpsElement from '~~~/Elements/UpsElement'
import MoreElement from '~~~/Elements/MoreElement'
import TabElement from '~~~/Elements/TabElement'

const ELEMENT_MAPPING = new Map([
  ['AlarmList', 'LatestAlarmElement'],
  ['List', 'ListElement'],
  ['More', 'MoreElement'],
  ['Tab', 'TabElement'],
  ['UPS', 'UpsElement']
])

const ELEMENTS = {
  LatestAlarmElement,
  ListElement,
  MoreElement,
  TabElement,
  UpsElement
}

export {
  ELEMENTS,
  ELEMENT_MAPPING
}
