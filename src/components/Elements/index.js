/**
* 元素部件集
* Author: dong xing
* Date: 2020/3/26
* Time: 12:49
* Email: dong.xing@outlook.com
*/

import ListElement from './ListElement.vue'
import LatestAlarmElement from './LatestAlarmElement'
import VideosElement from './VideosElement'

const ELEMENT_MAPPING = new Map([
  ['AlarmList', 'LatestAlarmElement'],
  ['List', 'ListElement'],
  ['Videos', 'VideosElement']
])

const ELEMENTS = {
  LatestAlarmElement,
  ListElement,
  VideosElement
}

export {
  ELEMENTS,
  ELEMENT_MAPPING
}
