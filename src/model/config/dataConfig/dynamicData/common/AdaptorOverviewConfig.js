import { TimeRangeConfig } from './TimeRangeConfig'
import { ViewDataService } from '@/api-hasura'
import _ from 'lodash'

export class AdaptorOverviewConfig {
  constructor ({
    alias = [],
    origin = [],
    // enum:  hour / minute / month
    isGroup = '',
    // enum: sum / max / avg
    calculateType = '',
    timeRangeConfig = {},
    refreshTime = 0
  }) {
    this.alias = alias
    this.origin = origin
    this.isGroup = isGroup
    this.calculateType = calculateType
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.refreshTime = refreshTime
  }

  async fetch () {
    const { data = [] } = await ViewDataService.overviewData(this.getOption())
    return this.transfer(data || [])
  }

  transfer (dataList = []) {
    return dataList.map(data => {
      const {
        alias,
        collect,
        origin,
        value
      } = data
      return {
        data: value,
        legend: alias,
        time: collect,
        name: origin
      }
    })
  }

  getOption () {
    return {
      ..._.omit(this, 'timeRangeConfig'),
      timeRange: this.timeRangeConfig.getOption()
    }
  }
}
