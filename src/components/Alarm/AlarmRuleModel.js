export default class AlarmRuleModel {
  constructor ({
    title = '',
    ruleType = 'merge',
    deviceType = '',
    deviceBrand = '',
    deviceModel = '',
    hostId = [],
    endpointId = '',
    metricId = '',
    content = '',
    type = '',
    enabled = true
  } = {}) {
    this.title = title
    this.ruleType = ruleType
    this.deviceType = deviceType
    this.deviceBrand = deviceBrand
    this.deviceModel = deviceModel
    this.hostId = hostId
    this.endpointId = endpointId
    this.metricId = metricId
    this.content = content
    this.type = type
    this.enabled = enabled
  }
}
