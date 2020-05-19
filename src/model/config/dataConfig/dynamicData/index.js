/**
 * 动态数据配置公共模块
 */

import _ from 'lodash'
import moment from 'moment'
import { KpiCurrentService } from '@/api-hasura'

// https://itbilu.com/nodejs/npm/EJlmbFhgg.html
const defaultTimeStart = {
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
}
const defaultTimeEnd = _.cloneDeep(defaultTimeStart)
export const timeRangeSelectOptions = [
  {
    name: '实时',
    value: Object.assign(defaultTimeStart, {})
  },
  {
    name: '最近15分钟',
    value: Object.assign({}, defaultTimeStart, { minutes: '-15' })
  },
  {
    name: '最近30分钟',
    value: Object.assign({}, defaultTimeStart, { minutes: '-30' })
  },
  {
    name: '最近1小时',
    value: Object.assign({}, defaultTimeStart, { hours: '-1' })
  },
  {
    name: '最近1天',
    value: Object.assign({}, defaultTimeStart, { days: '-1' })
  },
  {
    name: '最近1周',
    value: Object.assign({}, defaultTimeStart, { weeks: '-1' })
  },
  {
    name: '最近2周',
    value: Object.assign({}, defaultTimeStart, { weeks: '-2' })
  },
  {
    name: '最近1月',
    value: Object.assign({}, defaultTimeStart, { months: '-1' })
  },
  {
    name: '最近2月',
    value: Object.assign({}, defaultTimeStart, { months: '-2' })
  }
]

export class TimeRange {
  static FORMAT = 'YYYY-MM-DDTHH:mm:ss'

  constructor (
    timeRangeStart = _.cloneDeep(defaultTimeStart),
    timeRangeEnd = _.cloneDeep(defaultTimeEnd)
  ) {
    this.timeRangeStart = timeRangeStart
    this.timeRangeEnd = timeRangeEnd
  }

  /**
   * 获取时间段
   * @return {{ timeRangeStart: String, timeRangeEnd: String }} // 时间段
   */
  static getOption () {
    return {
      timeRangeStart: moment().add(this.timeRangeStart).format(TimeRange.FORMAT),
      timeRangeEnd: moment().add(this.timeRangeEnd).format(TimeRange.FORMAT)
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
    refreshTime = 0,
    // 外部 Ci 是否可用
    externalCi = true,
    timeRange = new TimeRange()
  }) {
    this.resourceConfig = resourceConfig
    this.externalCi = externalCi
    this.refreshTime = refreshTime
    this.timeRange = timeRange
    this.resetData()
  }

  fetch (argus = {}) {
    const { resourceConfig, timeRange } = this
    return KpiCurrentService.getValue({
      ...resourceConfig,
      timeRange: TimeRange.getOption.apply(timeRange),
      orderBy: { arising_time: 'asc' },
      ...argus
    })
  }

  getOption () {}

  resetData () {}
}
