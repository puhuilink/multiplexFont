/**
* 拓扑图属性配置对象
* Author: dong xing
* Date: 2020/1/14
* Time: 10:53 上午
* Email: dong.xing@outlook.com
*/

import _ from 'lodash'

export default class TopologyProprietaryConfig {
  constructor ({
    zoom = 1,
    nodes = [],
    edges = [],
    groups = [],
    plugins = []
  }) {
    this.zoom = zoom
    this.nodes = nodes
    // shape为polyline时controlPoints会自动生成与计算
    this.edges = edges.map(edge => _.omit(edge, edge.shape === 'polyline' ? ['controlPoints'] : []))
    this.groups = groups
    this.plugins = plugins
  }
}
