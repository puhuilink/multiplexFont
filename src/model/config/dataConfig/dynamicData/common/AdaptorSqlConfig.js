/**
 * 计数数据接口适配层
 */

import { AdaptorConfig } from './AdaptorConfig'
import { sql } from '@/utils/request'

export class AdaptorSqlConfig extends AdaptorConfig {
  constructor ({
    // 筛选所属区域
    sql = '',
    ...props
  }) {
    super(props)
    this.sql = sql
  }

  getOption () {
    return this.sql
  }

  get isAvailable () {
    return true
  }

  async fetch () {
    const text = await sql(this.sql)
    return text
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
