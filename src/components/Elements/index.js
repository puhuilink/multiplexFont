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
import SDMapElement from '~~~/Elements/SDMap/SDMapElement'
import ToLineElement from '~~~/Elements/ToLineElement'
import PercentElement from '~~~/Elements/PercentElement'
import DepartmentElement from '~~~/Elements/DepartmentElement'
import MVMapElement from '~~~/Elements/SDMap/MVMapElement'

const ELEMENT_MAPPING = new Map([
  ['AlarmList', 'LatestAlarmElement'],
  ['List', 'ListElement'],
  ['UPS', 'UpsElement'],
  ['Select', 'SelectElement'],
  ['More', 'MoreElement'],
  ['Tab', 'TabElement'],
  ['NewAlarm', 'NewAlarmElement'],
  ['UPS', 'UpsElement'],
  ['TimeSelector', 'TimeSelectorElement'],
  ['ToLine', 'ToLineElement'],
  ['Percent', 'PercentElement'],
  ['MMp', 'MVMapElement'],
  ['Department', 'DepartmentElement'],
  ['SDMap', 'SDMapElement']
])

const ELEMENTS = {
  LatestAlarmElement,
  ListElement,
  UpsElement,
  SelectElement,
  MoreElement,
  NewAlarmElement,
  TabElement,
  TimeSelectorElement,
  ToLineElement,
  PercentElement,
  MVMapElement,
  DepartmentElement,
  SDMapElement
}

export {
  ELEMENTS,
  ELEMENT_MAPPING
}
