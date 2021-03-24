/**
 * 性能数据接口中间层
 */

import _ from 'lodash'
import moment from 'moment'
import { AdaptorConfig } from './AdaptorConfig'
import { ViewDataService } from '@/api'
import { compare } from '@/utils/moment'
export class AdaptorResourceConfig extends AdaptorConfig {
  constructor ({
    deviceType = '',
    deviceBrand = '',
    deviceModel = '',
    hostId = [],
    endpointModelId = null,
    metricModelIds = [],
    metricIds = [],
    // 分组方式:  hour / minute / month
    isGroup = '',
    // 监控实体聚合方式：model / cmdb
    endpointAggregateMode = 'model',
    legendType = 'host',
    refreshTime = '',
    metricRefreshTime = '',
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
    this.endpointAggregateMode = endpointAggregateMode
    this.legendType = legendType
    this.metricIds = metricIds
    this.refreshTime = refreshTime
    this.metricRefreshTime = metricRefreshTime
  }

  get isAvailable () {
    return Boolean(
      this.deviceType &&
      this.deviceBrand &&
      this.deviceModel &&
      this.hostId && this.hostId.length &&
      this.endpointModelId &&
      this.metricModelIds && this.metricModelIds.length,
      this.refreshTime && this.metricRefreshTime.length
    )
  }

  getOption () {
    return _.omit(
      super.getOption(),
      ['endpointAggregateMode', 'legendType']
    )
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
    const { endpointAggregateMode, hostId } = this
    const groupByHost = hostId.length > 1
    const finalDataList = dataList

    return finalDataList
      .map(({
        collectTime = moment().format(),
        endpointAlias = '',
        endpointModelAlias = '',
        metricValue = 0,
        metricValueStr = '',
        metricAlias = '',
        metricName = '',
        hostAlias = '',
        uint = ''
      }) => {
        const endpoint = endpointAggregateMode === 'cmdb' ? endpointAlias : endpointModelAlias
        const metric = metricAlias || metricName
        // 去除 endpoint 与 metric 重名部分
        // 内存 + 总内存 = 内存总内存
        // CPU + CPU使用率 = CPU使用率
        const v = `${endpoint}${metric.startsWith(endpoint) ? metric.replace(endpoint, '') : metric}`
        const result = {
          data: ['', null, undefined].includes(metricValueStr) ? metricValue : metricValueStr,
          time: this.formatTime(collectTime, this.calculateType ? this.isGroup : null),
          legend: groupByHost ? hostAlias : v,
          name: !groupByHost ? hostAlias : v,
          unit: uint,
          endpointAlias,
          endpointModelAlias,
          metric
        }

        // TODO: hack for multiple hosts and metrics
        // 等待对接新接口
        if (
          ['香港负载上下行流量', '巴黎负载上下行流量'].includes(hostAlias) &&
          endpointModelAlias === '多端口流量求和' &&
          ['Output Rate', 'Input Rate'].includes(metricName)
        ) {
          Object.assign(result, {
            legend: hostAlias + metric
          })
        }

        return result
      })
      .filter(({ data }) => {
        if (typeof data === 'number') {
          return data >= 0
        }
        return true
      })
      .sort((a, b) => {
        return compare(a.time, b.time)
      })
  }
}
