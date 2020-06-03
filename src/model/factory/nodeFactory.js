/**
* 拓扑节点工厂
* Author: dong xing
* Date: 2020/2/11
* Time: 11:12 上午
* Email: dong.xing@outlook.com
*/
import CircleNode, { CiCircleNode } from '../nodes/CircleNode'
import RectNode from '../nodes/RectNode'
import EllipseNode from '../nodes/EllipseNode'
import ImageNode from '../nodes/ImageNode'

export const NODE_TYPE_CI_CIRCLE = 'ciCircleNode'

export class NodeFactory {
  static create (node) {
    switch (node.shape) {
      case 'circle':
        return new CircleNode(node)
      case 'ciCircleNode':
        return new CiCircleNode(node)
      case 'rect':
        return new RectNode(node)
      case 'ellipse':
        return new EllipseNode(node)
      case 'image':
        return new ImageNode(node)
      default:
        return null
    }
  }
}
