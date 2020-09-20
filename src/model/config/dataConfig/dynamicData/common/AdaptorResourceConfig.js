/**
 * 动态数据配置中间层
 * 用于字段映射与调整，解耦功能代码与业务代码
 */

// import _ from 'lodash'
import moment from 'moment'

export class AdaptorResourceConfig {
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
    calculateType = ''
  }) {
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

  static _formatTime (time = moment().format(), isGroup) {
    switch (isGroup) {
      case 'hour': return moment(time).format('YYYY-MM-DD HH:00:00')
      case 'minute': return moment(time).format('YYYY-MM-DD HH:mm:00')
      case 'month': return moment(time).format('YYYY-MM-DD')
      default: return moment(time).format()
    }
  }

  static transfer (dataList = [], isGroup) {
    return (dataList || []).map(data => {
      const {
        collectTime = moment().format(),
        endpointAlias = '',
        metricValue = 0,
        metricValueStr = '',
        // 单位：数据库字段本身错误
        uint = '',
        metricAlias = ''
      } = data
      return {
        data: (metricValueStr || metricValue) + uint,
        time: this._formatTime(collectTime, isGroup),
        name: metricAlias,
        legend: endpointAlias
      }
    })
  }

  getOption () {
    return {
      ...this
    }
  }
}
