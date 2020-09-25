import { AdaptorConfig } from './AdaptorConfig'
import { ViewDataService } from '@/api-hasura'
import _ from 'lodash'

export class AdaptorAlarmConfig extends AdaptorConfig {
  constructor ({
    origin = [],
    deviceType = [],
    level = [],
    refreshTime = 0,
    ...props
  }) {
    super(props)
    this.origin = origin
    this.deviceType = deviceType
    this.level = level
    this.refreshTime = refreshTime
  }

  async fetch () {
    const { data = [] } = await ViewDataService.alarmData(this.getOption())
    // console.log(data)
    return this.transfer(data || [])
  }

  transfer (dataList = []) {
    return dataList.map(data => {
      const {
        alias = '',
        collect = '',
        origin,
        level1 = 0,
        level2 = 0,
        level3 = 0,
        level4 = 0,
        level5 = 0
      } = data
      return {
        legend: alias,
        time: collect,
        name: origin,
        level1,
        level2,
        level3,
        level4,
        level5
        // data: [level1, level2, level3, level4, level5]
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
