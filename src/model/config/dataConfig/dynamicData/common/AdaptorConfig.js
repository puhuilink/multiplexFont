/**
 * 动态数据配置中间层
 * 用于字段映射与调整，解耦功能代码与业务代码
 */

import { TimeRangeConfig } from './TimeRangeConfig'
import _ from 'lodash'

export class AdaptorConfig {
  constructor ({
    refreshTime = 0,
    timeRangeConfig = {},
    // 计算类型: sum / max / avg
    calculateType = ''
  }) {
    this.refreshTime = refreshTime
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.calculateType = calculateType
  }

  fetch () {}

  getOption () {
    return {
      ..._.omit(this, 'timeRangeConfig'),
      timeRange: this.timeRangeConfig.getOption()
    }
  }

  getTimeoutOption () {
    const { refreshTime } = this
    return {
      ...refreshTime ? {
        timeout: refreshTime * 1000 * 60
      } : {}
    }
  }
}
