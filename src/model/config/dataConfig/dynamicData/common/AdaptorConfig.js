/**
 * 动态数据配置中间层
 * 用于字段映射与调整，解耦功能代码与业务代码
 */

import { TimeRangeConfig } from './TimeRangeConfig'
import _ from 'lodash'
import moment from 'moment'
import {
  GROUP_TYPE_MONTH,
  GROUP_TYPE_DAY,
  GROUP_TYPE_HOUR,
  GROUP_TYPE_MINUTE
} from '../types/isGroup'

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

  fetch () { }

  formatTime (time = moment().format(), groupBy = '') {
    switch (groupBy) {
      case GROUP_TYPE_MINUTE: return moment(time).format('HH:mm:00')
      case GROUP_TYPE_HOUR: return moment(time).format('HH:00:00')
      case GROUP_TYPE_DAY: return moment(time).format('MM-DD')
      case GROUP_TYPE_MONTH: return moment(time).format('YYYY-MM')
      default: return time
    }
  }

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
