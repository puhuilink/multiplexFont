import { TimeRangeConfig } from './TimeRangeConfig'

export class AdaptorOverviewConfig {
  constructor ({
    origin = [],
    // enum:  hour / minute / month
    isGroup = '',
    // enum: sum / max / avg
    calculateType = '',
    timeRangeConfig = {}
  }) {
    this.origin = origin
    this.isGroup = isGroup
    this.calculateType = calculateType
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
  }
}
