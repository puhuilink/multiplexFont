/* eslint-disable camelcase */

export class BaseModel {
  constructor () {
    // 对应数据表的名字
    this.table = 'base'
    // 对应 appllo client
    this.hasura = null
  }

  find ({
    where = {},
    orderBy = {},
    fields = [],
    limit = 0,
    offset = 0
  }) {
    const v = this.hasura(this.table)
      .where(where)
      .orderBy(orderBy)
      .select(fields)
    if (limit || offset) {
      return v.paginate(limit, offset)
    } else {
      return v
    }
  }
}
