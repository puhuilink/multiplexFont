/**
 * 总览数据接口适配层
 */

import { TimeRangeConfig } from './TimeRangeConfig'
import { ViewDataService } from '@/api-hasura'
import _ from 'lodash'
import moment from 'moment'

export class AdaptorOverviewConfig {
  constructor ({
    // 检查项
    alias = [],
    // 数据域
    origin = [],
    // 分组方式:  hour / minute / month
    isGroup = '',
    // 计算类型: sum / max / avg
    calculateType = '',
    // 时间范围
    timeRangeConfig = {},
    // 定时刷新时间(分钟)
    refreshTime = 0
  }) {
    this.alias = alias
    this.origin = origin
    this.isGroup = isGroup
    this.calculateType = calculateType
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.refreshTime = refreshTime
  }

  fetch () {
    return ViewDataService
      .overviewData(this.getOption())
      .then(({ data = [] }) => data)
      .catch(() => [])
      .then(this.transfer)
  }

  transfer (dataList = []) {
    return dataList
      .map(({
        alias = '',
        collect = moment().format(),
        origin = '',
        value = 0
      }) => ({
        data: value,
        legend: alias,
        time: collect,
        name: origin
      }))
  }

  getOption () {
    return {
      ..._.omit(this, 'timeRangeConfig'),
      timeRange: this.timeRangeConfig.getOption()
    }
  }
}
