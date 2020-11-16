/**
 * 性能数据接口中间层
 */

import _ from 'lodash'
import moment from 'moment'
import { AdaptorConfig } from './AdaptorConfig'
import { ViewDataService } from '@/api'

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
    this.hostId = _.castArray(hostId)
    this.endpointModelId = endpointModelId
    this.metricModelIds = _.castArray(metricModelIds)
    this.isGroup = isGroup
  }

  fetch () {
    return ViewDataService
      .realData(this.getOption(), this.getTimeoutOption())
      .then(({ data }) => data || [])
      .catch(() => [])
      .then(this.transfer.bind(this))
  }

  transfer (dataList = []) {
    // 可以查看一台设备的多个 metric 或多台设备的一个 metric
    // 具体以哪种方式组织根据选择项的长度来判断
    const groupByHost = this.hostId.length > 1
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
        legend: groupByHost ? hostAlias : endpointAlias + metricAlias,
        name: !groupByHost ? hostAlias : endpointAlias + metricAlias,
        unit: uint
      }))
  }
}
