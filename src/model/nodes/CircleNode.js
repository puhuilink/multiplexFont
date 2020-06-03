/**
* 拓扑圆形节点
* Author: dong xing
* Date: 2020/2/11
* Time: 11:14 上午
* Email: dong.xing@outlook.com
*/
import Node, { NodeDynamicDataConfig } from './index'
import { TopologyIcon } from '../common'

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
}
