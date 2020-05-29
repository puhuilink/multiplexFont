/**
 * 动态数据配置公共模块
 */

import _ from 'lodash'
import moment from 'moment'
import { KpiCurrentService } from '@/api-hasura'

export const TIME_RANGE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
export const TIME_RANGE_TYPE_DEFAULT = 'default'
export const TIME_RANGE_TYPE_RECENT = 'recent'
export const TIME_RANGE_TYPE_CUSTOM = 'custom'
export const TIME_TYPE_SECONDS = 'seconds'
export const TIME_TYPE_MINUTES = 'minutes'
export const TIME_TYPE_HOURS = 'hours'
export const TIME_TYPE_DAYS = 'days'
export const TIME_TYPE_WEEKS = 'weeks'
export const TIME_TYPE_MONTHS = 'months'
export const TIME_TYPE_YEARS = 'years'

// https://itbilu.com/nodejs/npm/EJlmbFhgg.html
export const DEFAULT_TIME_RANGE_START = {
  [TIME_TYPE_YEARS]: 0,
  [TIME_TYPE_MONTHS]: 0,
  [TIME_TYPE_WEEKS]: 0,
  [TIME_TYPE_DAYS]: 0,
  [TIME_TYPE_HOURS]: 0,
  [TIME_TYPE_MINUTES]: 0,
  [TIME_TYPE_SECONDS]: 0
}
export const DEFAULT_TIME_RANGE_END = _.cloneDeep(DEFAULT_TIME_RANGE_START)

export class TimeRange {
  constructor ({
    timeRangeStart = _.cloneDeep(DEFAULT_TIME_RANGE_START),
    timeRangeEnd = _.cloneDeep(DEFAULT_TIME_RANGE_END),
    timeRangeType = TIME_RANGE_TYPE_DEFAULT,
    recentType = TIME_TYPE_MINUTES,
    recentValue = 0,
    customTimeRange = [
      moment().format(TIME_RANGE_FORMAT),
      moment().format(TIME_RANGE_FORMAT)
    ]
  }
  ) {
    this.timeRangeStart = timeRangeStart
    this.timeRangeEnd = timeRangeEnd
    this.timeRangeType = timeRangeType
    this.recentType = recentType
    this.recentValue = recentValue
    this.customTimeRange = customTimeRange
  }

  static getOption () {
    const { timeRangeType } = this
    switch (timeRangeType) {
      case TIME_RANGE_TYPE_DEFAULT: {
        const { timeRangeStart, timeRangeEnd } = this
        return {
          timeRangeStart: moment().add(timeRangeStart).format(TIME_RANGE_FORMAT),
          timeRangeEnd: moment().add(timeRangeEnd).format(TIME_RANGE_FORMAT)
        }
      }
      case TIME_RANGE_TYPE_RECENT: {
        const { recentType, recentValue } = this
        const timeRangeStart = Object.assign(DEFAULT_TIME_RANGE_START, { [recentType]: recentValue })
        return {
          timeRangeStart: moment().add(timeRangeStart).format(TIME_RANGE_FORMAT),
          timeRangeEnd: moment().format(TIME_RANGE_FORMAT)
        }
      }
      case TIME_RANGE_TYPE_CUSTOM: {
        const { customTimeRange = [] } = this
        const [timeRangeStart, timeRangeEnd] = customTimeRange
        return {
          timeRangeStart,
          timeRangeEnd
        }
      }
    }
  }
}

export class DynamicDataConfig {
  constructor ({
    resourceConfig = {
      model: '',
      selectedInstance: [],
      selectedKpi: [],
      detailInstance: []
    },
    // 横轴类型
    xAxisType = 'RESOURCE',
    refreshTime = 0,
    // 外部 Ci 是否可用
    externalCi = true,
    timeRange = new TimeRange({})
  }) {
    this.resourceConfig = resourceConfig
    this.externalCi = externalCi
    this.refreshTime = refreshTime
    this.timeRange = timeRange
    this.xAxisType = xAxisType
    this.resetData()
  }

  fetch (argus = {}) {
    const { resourceConfig, timeRange } = this
    return KpiCurrentService.getValue({
      ...resourceConfig,
      timeRange: timeRange.getOption(),
      orderBy: { arising_time: 'desc' },
      ...argus
    })
  }

  getOption () {}

  resetData () {}
}
