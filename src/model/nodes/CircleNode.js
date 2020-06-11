/**
* 拓扑圆形节点
* Author: dong xing
* Date: 2020/2/11
* Time: 11:14 上午
* Email: dong.xing@outlook.com
*/
import Node, { NodeDynamicDataConfig } from './index'
import { TopologyIcon } from '../common'
import { AlertService } from '@/api-hasura'
import _ from 'lodash'
import { emitter } from '../charts/TopologyChart'

export default class CircleNode extends Node {
  constructor ({ nodeDynamicDataConfig = {}, icon, ...node }) {
    super(node)
    this.icon = new TopologyIcon(icon || {})
  }

  refresh () {
    console.log('定时刷新动画')
    // MOCK
    const arr = ['1级告警', '2级告警', '3级告警', '4级告警']
    const index = Math.floor(Math.random() * arr.length)
    emitter.emit('animateType:change', {
      item: this,
      animateType: arr[index]
    })
  }

  intervalRefresh () {
    // TODO: 允许自定义刷新时间？
    this.refresh()
    this.timer = setInterval(this.refresh.bind(this), 1500)
  }

  restartIntervalRefresh () {
    this.resetTimer()
    this.intervalRefresh()
  }
}

export class CiCircleNode extends CircleNode {
  constructor ({ nodeDynamicDataConfig = {}, ...circleNode }) {
    super(circleNode)
    this.nodeDynamicDataConfig = new NodeDynamicDataConfig(nodeDynamicDataConfig)
  }

  async getOption () {
    const { animateType: defaultAnimateType, nodeDynamicDataConfig } = this
    const { resourceConfig: { selectedInstance } } = nodeDynamicDataConfig
    const [ciId] = selectedInstance
    const useRealAnimateType = defaultAnimateType === 'real'
    const tasks = [
      nodeDynamicDataConfig.getOption()
    ]

    // 从告警列表获取配置并以动画呈现
    if (useRealAnimateType && ciId) {
      tasks.push(
        AlertService.find({
          where: { dev_name: ciId },
          fields: ['severity'],
          limit: 1,
          alias: 'data'
        }).then(r => r.data[0])
          .then(r => _.get(r, 'severity'))
          .then(r => r ? `${r + 1}级告警` : 'none')
      )
    }

    // eslint-disable-next-line no-unused-vars
    const [realData, realAnimateType] = await Promise.all(tasks)

    const { attrList, kpiList } = realData

    // TODO: get the instance of graph
    // TODO: dynamic configure tooltip
    const graph = {}
    this.data = {
      attrList,
      kpiList
    }
    graph.setItemState(this, useRealAnimateType ? realAnimateType : defaultAnimateType, true)
  }
}
