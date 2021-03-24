/**
* 拓扑圆形节点
*/

import Node from './index'
import { TopologyIcon } from '../common/index'
import { AdaptorResourceConfig } from '../config/dataConfig/dynamicData/common/AdaptorResourceConfig'
import _ from 'lodash'
import './circleNode.less'

export const runTimeNodes = {}
export default class CircleNode extends Node {
  constructor ({
    icon = {},
    resourceConfig = {},
    ...node
  }) {
    super(node)
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.icon = new TopologyIcon(icon || {})
    runTimeNodes[this.id] = this
  }

  async getRealDataOption () {
    // FIXME: resourceConfig 运行过程中被改变为普通对象
    if (!(this.resourceConfig instanceof AdaptorResourceConfig)) {
      this.resourceConfig = new AdaptorResourceConfig(this.resourceConfig)
    }

    const dataList = await new AdaptorResourceConfig(this.resourceConfig).fetch()
    // const dataList = await this.resourceConfig.fetch()
    if (_.isEmpty(dataList)) {
      this.tooltipContent = ''
    } else {
      const [{ name }] = dataList
      // FIXME: 构建出的 DOM 层级错误与样式未生效
      this.tooltipContent = `
        <div class="CircleNode__tooltipContent>
        
          <div class="CircleNode__tooltipContent-title">${name}</div>
          ${dataList.map(({ legend = '', name = '', data = 0, unit = '' }) => `
            <div class="CircleNode__tooltipContent-content">
              <span class="class="CircleNode__tooltipContent-content_label">${legend}: </span>
              <span class="class="CircleNode__tooltipContent-content_value">${data} ${unit}</span>
            </div>
          `).join('')}
        </div>
      `
    }
  }

  intervalRefresh () {
    if (!this.resourceConfig.isAvailable) return
    this.getRealDataOption()
    this.timer = setInterval(() => {
      this.getRealDataOption()
    }, 1000 * 60)
  }

  restartIntervalRefresh () {
    this.resetTimer()
    this.intervalRefresh()
  }

  destroy () {
    super.destroy()
    Reflect.deleteProperty(runTimeNodes, this.id)
  }
}
