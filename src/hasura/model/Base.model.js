/* eslint-disable camelcase */

export class BaseModel {
  constructor () {
    this.table = 'base'
  }

  allList ({
    where = {},
    orderBy = { rest: 'asc' }
  }) {
    return this.hasura(this.table)
      .where(where)
      .orderBy(orderBy)
      .query()
  }

  listWithPagination ({
    where = {},
    orderBy = { rest: 'asc' },
    limit = 9999,
    offset = 0,
    fields = ['id']
  }) {
    return this.hasura(this.table)
      .where(where)
      .select(fields.join(','))
      .orderBy(orderBy)
      .paginate(limit, offset)
      // .query()
  }

  find ({
    where = {},
    orderBy = { rest: 'asc' },
    limit = 9999,
    offset = 0
  }) {
    this.hasura(this.table)
      .where(where)
      .orderBy(orderBy)
      .paginate(limit, offset)
      .query()
  }
}
