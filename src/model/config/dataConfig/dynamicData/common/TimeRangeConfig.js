import _ from 'lodash'
import moment from 'moment'

export const TIME_RANGE_FORMAT = 'YYYY-MM-DD HH:mm:ss'
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

export class TimeRangeConfig {
  constructor ({
    startTime = _.cloneDeep(DEFAULT_TIME_RANGE_START),
    endTime = _.cloneDeep(DEFAULT_TIME_RANGE_END),
    timeRangeType = TIME_RANGE_TYPE_DEFAULT,
    recentType = TIME_TYPE_MINUTES,
    recentValue = 0,
    customTimeRange = [
      moment().format(TIME_RANGE_FORMAT),
      moment().format(TIME_RANGE_FORMAT)
    ]
  }
  ) {
    this.startTime = startTime
    this.endTime = endTime
    this.timeRangeType = timeRangeType
    this.recentType = recentType
    this.recentValue = recentValue
    this.customTimeRange = customTimeRange
  }

  getOption () {
    const { timeRangeType } = this
    switch (timeRangeType) {
      case TIME_RANGE_TYPE_DEFAULT: {
        const { startTime, endTime } = this
        // 实时数据
        // console.log(startTime, endTime)
        if (Object.values(startTime).every(v => v === 0) && Object.values(endTime).every(v => v === 0)) {
          return {}
        }
        // 历史数据
        return {
          startTime: moment().add(startTime).format(TIME_RANGE_FORMAT),
          endTime: moment().add(endTime).format(TIME_RANGE_FORMAT)
        }
      }
      case TIME_RANGE_TYPE_RECENT: {
        const { recentType, recentValue } = this
        const startTime = Object.assign({}, DEFAULT_TIME_RANGE_START, { [recentType]: recentValue })
        return {
          startTime: moment().add(startTime).format(TIME_RANGE_FORMAT),
          endTime: moment().format(TIME_RANGE_FORMAT)
        }
      }
      case TIME_RANGE_TYPE_CUSTOM: {
        const { customTimeRange = [] } = this
        const [startTime, endTime] = customTimeRange
        return {
          startTime,
          endTime
        }
      }
    }
  }
}
