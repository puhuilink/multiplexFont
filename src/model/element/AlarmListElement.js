/**
* 告警列表
* Author: dong xing
* Date: 2020/4/7
* Time: 10:55
* Email: dong.xing@outlook.com
*/
import anime from 'animejs'
import Element from './index'

export default class AlarmListElement extends Element {
  mergeOption ({ proprietaryConfig }) {
    anime.set(this.element, {
      ...proprietaryConfig.getOption()
    })
  }
}
