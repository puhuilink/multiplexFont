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

export default class CircleNode extends Node {
  constructor ({ nodeDynamicDataConfig = {}, icon, ...node }) {
    super(node)
    this.icon = new TopologyIcon(icon || {})
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

    // TODO: get the instance of graph
    // TODO: dynamic configure tooltip
    const graph = {}
    graph.setItemState(this, useRealAnimateType ? realAnimateType : defaultAnimateType, true)
  }
}
