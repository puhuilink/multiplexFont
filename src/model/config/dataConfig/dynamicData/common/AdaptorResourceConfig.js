/**
 * 性能数据接口中间层
 */

// import _ from 'lodash'
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
    // 分组方式:  hour / minute / month
    isGroup = '',
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
  }

  fetch () {
    return ViewDataService
      .realData(this.getOption(), this.getTimeoutOption())
      .then(({ data = [] }) => data)
      .catch(() => [])
      .then(this.transfer.bind(this))
  }

  transfer (dataList = []) {
    return dataList
      .map(({
        collectTime = moment().format(),
        endpointAlias = '',
        metricValue = 0,
        metricValueStr = '',
        metricAlias = '',
        hostAlias = '',
        uint = ''
      }) => ({
        data: metricValueStr || metricValue,
        time: this.formatTime(collectTime, this.isGroup),
        legend: endpointAlias + metricAlias,
        name: hostAlias,
        unit: uint
      }))
  }
}
