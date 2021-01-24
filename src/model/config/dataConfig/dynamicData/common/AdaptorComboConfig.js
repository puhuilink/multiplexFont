import { TimeRangeConfig } from './TimeRangeConfig'
import { ViewDataService } from '@/api/index'
import moment from 'moment'

export class AdaptorComboConfig {
  constructor ({
    dataType = '1',
    isGroup = null,
    calculateType = null,
    timeRangeConfig = {},
    top = null,
    content = [],
    refreshTime = 0,
    delayTime = 0
  }) {
    this.dataType = dataType
    this.isGroup = isGroup
    this.calculateType = calculateType
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
    this.top = top
    this.content = content
    this.refreshTime = refreshTime
    this.delayTime = delayTime
  }

  // TODO:
  get isAvailable () {
    return true
  }

  getOption () {
    const { dataType, isGroup, calculateType, top, content, timeRangeConfig } = this

    return {
      dataType,
      isGroup,
      calculateType,
      top,
      content,
      timeRange: timeRangeConfig.getOption()
    }
  }

  fetch () {
    return ViewDataService
      .comboData(this.getOption())
      .then(({ data }) => data || [])
      .catch(() => [])
      .then(this.transfer.bind(this))
  }

  transfer (obj = {}) {
    return Object
      .values(obj)
      .flat()
      .map(({
        bucket = moment().format(),
        hostAlias = '',
        endpointModelAlias = '',
        metricModelAlias = '',
        metricValue = 0,
        metricValueStr = '',
        unit = ''
      }) => ({
        data: metricValue || metricValueStr,
        legend: hostAlias,
        name: `${endpointModelAlias}__${metricModelAlias}`,
        time: bucket,
        unit
      }))
  }
}
