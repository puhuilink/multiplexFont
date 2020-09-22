/**
* 拓扑圆形节点
* Author: dong xing
* Date: 2020/2/11
* Time: 11:14 上午
* Email: dong.xing@outlook.com
*/
import Node from './index'
import { TopologyIcon } from '../common'
// import { emitter } from '../charts/TopologyChart'

export default class CircleNode extends Node {
  constructor ({ nodeDynamicDataConfig = {}, icon, ...node }) {
    super(node)
    this.icon = new TopologyIcon(icon || {})
    this.animateTypeList = ['none', '1级告警', '2级告警', '3级告警', '4级告警']
  }

  refresh () {
    // console.log('定时刷新动画')
    // // MOCK
    // const level = Math.floor(Math.random() * this.animateTypeList.length)
    // emitter.emit('animateType:change', {
    //   item: this,
    //   animateType: this.animateTypeList[level]
    // })
  }

  intervalRefresh () {
    // TODO: 允许自定义刷新时间？
    this.refresh()
    this.timer = setInterval(this.refresh.bind(this), 15000)
  }

  restartIntervalRefresh () {
    this.resetTimer()
    this.intervalRefresh()
  }
}
