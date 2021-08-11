/**
 * 计数数据接口适配层
 */

import { ViewDataService } from '@/api'
import { AdaptorConfig } from './AdaptorConfig'

export class AdaptorNumConfig extends AdaptorConfig {
  constructor ({
    // 筛选所属区域
    location = [],
    type = false,
    ...props
  }) {
    super(props)
    this.location = location
  }

  getOption () {
    return this.location.map(el => '\'' + el + '\'')
  }

  get isAvailable () {
    return true
  }

  fetch () {
    return ViewDataService.NumTop(this.getOption())
  }

  // transfer (dataList = []) {
  //   return dataList
  //     .map(({
  //       alias = '',
  //       collect = moment().format(),
  //       origin = '',
  //       value = 0
  //     }) => ({
  //       data: value,
  //       legend: alias,
  //       time: this.formatTime(collect, this.isGroup),
  //       name: origin
  //     }))
  //     .filter(({ data }) => {
  //       if (typeof data === 'number') {
  //         return data >= 0
  //       }
  //       return true
  //     })
  //     .sort((a, b) => {
  //       return compare(a.time, b.time)
  //     })
  // }
}
