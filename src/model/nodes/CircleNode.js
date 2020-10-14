/**
* 拓扑圆形节点
*/
import Node from './index'
import { TopologyIcon } from '../common/index'
// import { emitter } from '../charts/TopologyChart'
import { AdaptorResourceConfig } from '../config/dataConfig/dynamicData/common/AdaptorResourceConfig'
import { AdaptorAlarmConfig } from '../config/dataConfig/dynamicData/common/AdaptorAlarmConfig'
import _ from 'lodash'
import './circleNode.less'

export default class CircleNode extends Node {
  constructor ({
    icon = {},
    resourceConfig = {},
    alarmConfig = {},
    ...node
  }) {
    super(node)
    this.resourceConfig = new AdaptorResourceConfig(resourceConfig)
    this.alarmConfig = new AdaptorAlarmConfig(alarmConfig)
    this.icon = new TopologyIcon(icon || {})
    this.animateTypeList = ['none', '1级告警', '2级告警', '3级告警', '4级告警']
  }

  async getAlarmOption () {
    // const level = Math.floor(Math.random() * this.animateTypeList.length)
    // emitter.emit('animateType:change', {
    //   item: this,
    //   animateType: this.animateTypeList[level]
    // })
  }

  async getRealDataOption () {
    const dataList = await this.resourceConfig.fetch()
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

  async refresh () {
    await Promise.all([
      this.getAlarmOption(),
      this.getRealDataOption()
    ])
  }

  intervalRefresh () {
    this.refresh()
    this.timer = setInterval(this.refresh.bind(this), 1000 * 60)
  }

  restartIntervalRefresh () {
    this.resetTimer()
    this.intervalRefresh()
  }
}
