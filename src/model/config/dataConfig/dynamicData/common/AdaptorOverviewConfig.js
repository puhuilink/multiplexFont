/**
 * 总览数据接口适配层
 */

import { ViewDataService } from '@/api'
import { AdaptorConfig } from './AdaptorConfig'
import moment from 'moment'
import _ from 'lodash'
import { compare } from '@/utils/moment'

export class AdaptorOverviewConfig extends AdaptorConfig {
  constructor ({
    // 设备
    hostAlias = '',
    // 监控实体
    endpointAlias = '',
    // 检查项
    alias = [],
    // 数据域
    origin = [],
    // 分组方式:  hour / minute / month
    isGroup = '',
    ...props
  }) {
    super(props)
    this.hostAlias = hostAlias
    this.endpointAlias = endpointAlias
    this.alias = alias
    this.origin = origin
    this.isGroup = isGroup
  }

  get isAvailable () {
    return Boolean(
      this.alias && this.alias.length
    )
  }

  getOption () {
    const { timeRangeConfig, ...rest } = this;

    ['hostAlias', 'endpointAlias', 'origin', 'isGroup'].forEach((key) => {
      if (!rest[key] || _.isEmpty(rest[key])) {
        Reflect.deleteProperty(rest, key)
      }
    })

    return {
      ...rest,
      timeRange: this.timeRangeConfig.getOption()
    }
  }

  fetch () {
    return ViewDataService
      .overviewData(this.getOption(), this.getTimeoutOption())
      .then(({ data = [] }) => data)
      .catch(() => [])
      .then(this.transfer.bind(this))
  }

  transfer (dataList = []) {
    return dataList
      .map(({
        alias = '',
        collect = moment().format(),
        origin = '',
        value = 0
      }) => ({
        data: value,
        legend: alias,
        time: this.formatTime(collect, this.isGroup),
        name: origin
      }))
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
