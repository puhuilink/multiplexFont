/**
 * 动态数据配置中间层
 * 用于字段映射与调整，解耦功能代码与业务代码
 */

import _ from 'lodash'
import moment from 'moment'
import { AdaptorConfig } from './AdaptorConfig'
import { ViewDataService } from '@/api-hasura'

export class AdaptorResourceConfig extends AdaptorConfig {
  get useGroup () {
    const { isGroup, calculateType } = this
    return calculateType ? isGroup : ''
  }

  async fetch () {
    const { data = [] } = await ViewDataService.chartValue(this.getOption())
    return this.transfer(data || [])
  }

  static _formatTime (time = moment().format(), isGroup) {
    switch (isGroup) {
      // FIXME: 自动补全
      case 'hour': return moment(time).format('YYYY-MM-DD HH:00:00')
      case 'minute': return moment(time).format('YYYY-MM-DD HH:mm:00')
      case 'month': return moment(time).format('YYYY-MM-DD')
      default: return moment(time).format()
    }
  }

  transfer (dataList = [], isGroup) {
    return (dataList).map(data => {
      const {
        collectTime = moment().format(),
        endpointAlias = '',
        metricValue = 0,
        metricValueStr = '',
        // 单位：数据库字段本身错误
        // uint = '',
        // metricAlias = '',
        hostAlias = ''
      } = data
      return {
        data: (metricValueStr || metricValue),
        // data: (metricValueStr || metricValue) + uint,
        // time: this._formatTime(collectTime, isGroup),
        time: collectTime,
        // name: metricAlias,
        legend: endpointAlias,
        name: hostAlias
      }
    })
  }

  getOption () {
    return {
      ..._.omit(this, 'timeRangeConfig'),
      timeRange: this.timeRangeConfig.getOption()
    }
  }
}
