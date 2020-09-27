/**
 * 总览数据接口适配层
 */

import { ViewDataService } from '@/api-hasura'
import { AdaptorConfig } from './AdaptorConfig'
import moment from 'moment'

export class AdaptorOverviewConfig extends AdaptorConfig {
  constructor ({
    // 检查项
    alias = [],
    // 数据域
    origin = [],
    // 分组方式:  hour / minute / month
    isGroup = '',
    ...props
  }) {
    super(props)
    this.alias = alias
    this.origin = origin
    this.isGroup = isGroup
  }

  fetch () {
    return ViewDataService
      .overviewData(this.getOption(), this.getTimeoutOption())
      .then(({ data = [] }) => data)
      .catch(() => [])
      .then(this.transfer)
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
        time: collect,
        name: origin
      }))
  }
}
