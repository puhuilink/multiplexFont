/**
 * 性能数据接口中间层
 */

import _ from 'lodash'
import moment from 'moment'
import { AdaptorConfig } from './AdaptorConfig'
import { ViewDataService } from '@/api-hasura'

export class AdaptorResourceConfig extends AdaptorConfig {
  constructor ({
    deviceType = 'Host',
    deviceBrand = 'HostLinux',
    deviceModel = 'HostAIXLinux',
    hostId = [],
    endpointModelId = 1149375446,
    metricModelIds = [],
    // enum:  hour / minute / month
    isGroup = '',
    // enum: sum / max / avg
    calculateType = '',
    ...props
  }) {
    super(props)
    this.deviceType = deviceType
    this.deviceBrand = deviceBrand
    this.deviceModel = deviceModel
    this.hostId = hostId
    this.endpointModelId = endpointModelId
    this.metricModelIds = metricModelIds
    this.isGroup = isGroup
    this.calculateType = calculateType
  }

  get useGroup () {
    const { isGroup, calculateType } = this
    return calculateType ? isGroup : ''
  }

  fetch () {
    return ViewDataService
      .realData(this.getOption(), this.getTimeoutOption())
      .then(({ data = [] }) => data)
      .catch(() => [])
      .then(this.transfer)
  }

  static _formatTime (time = moment().format(), isGroup) {
    switch (isGroup) {
      // FIXME: 自动补全
      case 'hour': return moment(time).format('HH:00:00')
      case 'minute': return moment(time).format('HH:mm:00')
      case 'day': return moment(time).format('YYYYY-MM-DD')
      case 'month': return moment(time).format('YYYY-MM')
      default: return moment(time).format()
    }
  }

  transfer (dataList = [], isGroup) {
    return dataList
      .map(({
        collectTime = moment().format(),
        endpointAlias = '',
        metricValue = 0,
        metricValueStr = '',
        hostAlias = ''
      }) => ({
        data: metricValueStr || metricValue,
        time: collectTime,
        legend: endpointAlias,
        name: hostAlias
      }))
  }

  getOption () {
    return {
      ..._.omit(this, 'timeRangeConfig'),
      timeRange: this.timeRangeConfig.getOption()
    }
  }
}
