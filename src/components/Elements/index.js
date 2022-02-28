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
import SelectElement from '~~~/Elements/SelectElement'
import NewAlarmElement from '~~~/Elements/NewAlarmElement'
import TimeSelectorElement from '~~~/Elements/TimeSelectorElement'

const ELEMENT_MAPPING = new Map([
  ['AlarmList', 'LatestAlarmElement'],
  ['List', 'ListElement'],
  ['UPS', 'UpsElement'],
  ['Select', 'SelectElement'],
  ['More', 'MoreElement'],
  ['Tab', 'TabElement'],
  ['NewAlarm', 'NewAlarmElement'],
  ['UPS', 'UpsElement'],
  ['TimeSelector', 'TimeSelectorElement']
])

const ELEMENTS = {
  LatestAlarmElement,
  ListElement,
  UpsElement,
  SelectElement,
  MoreElement,
  NewAlarmElement,
  TabElement,
  TimeSelectorElement
}

export {
  ELEMENTS,
  ELEMENT_MAPPING
}
