/**
 * 动态数据配置中间层
 * 用于字段映射与调整，解耦功能代码与业务代码
 */

import { TimeRangeConfig } from './TimeRangeConfig'

export class AdaptorConfig {
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
    timeRangeConfig = {}
  }) {
    this.deviceType = deviceType
    this.deviceBrand = deviceBrand
    this.deviceModel = deviceModel
    this.hostId = hostId
    this.endpointModelId = endpointModelId
    this.metricModelIds = metricModelIds
    this.isGroup = isGroup
    this.calculateType = calculateType
    this.timeRangeConfig = new TimeRangeConfig(timeRangeConfig)
  }

  fetch () {}

  getOption () {}
}
