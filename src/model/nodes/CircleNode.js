/**
* 拓扑圆形节点
* Author: dong xing
* Date: 2020/2/11
* Time: 11:14 上午
* Email: dong.xing@outlook.com
*/
import Node from './index'
import { TopologyIcon } from '../common/index'
import { emitter } from '../charts/TopologyChart'
import { AdaptorResourceConfig } from '../config/dataConfig/dynamicData/common/AdaptorResourceConfig'

export default class CircleNode extends Node {
  constructor ({
    nodeDynamicDataConfig = {},
    icon = {},
    resourceConfig = {},
    ...node
  }) {
    super(node)
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.icon = new TopologyIcon(icon || {})
    this.animateTypeList = ['none', '1级告警', '2级告警', '3级告警', '4级告警']
    // TODO: 保存到配置时剔除该项
    this.tooltipContent = ``
  }

  fetch () {
    return this.resourceConfig.fetch()
  }

  async refresh () {
    console.log('node 定时器开启')
    try {
      const [{ legend = '', name = '', data = 0 }] = await this.fetch()
      this.tooltipContent = `${legend} - ${name}：${data}`
      const level = Math.floor(Math.random() * this.animateTypeList.length)
      emitter.emit('animateType:change', {
        item: this,
        animateType: this.animateTypeList[level]
      })
    } catch (e) {
      throw e
    }
  }

  intervalRefresh () {
    // TODO: 允许自定义刷新时间？
    this.refresh()
    // FIXME: 存在内存泄漏
    this.timer = setInterval(this.refresh.bind(this), 15000)
  }

  restartIntervalRefresh () {
    this.resetTimer()
    this.intervalRefresh()
  }
}
