/**
* 拓扑节点工厂
* Author: dong xing
* Date: 2020/2/11
* Time: 11:12 上午
* Email: dong.xing@outlook.com
*/
import CircleNode from '../nodes/CircleNode'
import RectNode from '../nodes/RectNode'
import EllipseNode from '../nodes/EllipseNode'
import ImageNode from '../nodes/ImageNode'
import {
  NODE_TYPE_CIRCLE,
  NODE_TYPE_ELLIPSE,
  NODE_TYPE_RECT,
  NODE_TYPE_IMAGE
} from '@/plugins/g6-types'

export class NodeFactory {
  static create (node) {
    switch (node.shape) {
      case NODE_TYPE_CIRCLE:
        return new CircleNode(node)
      case NODE_TYPE_RECT:
        return new RectNode(node)
      case NODE_TYPE_ELLIPSE:
        return new EllipseNode(node)
      case NODE_TYPE_IMAGE:
        return new ImageNode(node)
      default:
        return null
    }
  }
}
