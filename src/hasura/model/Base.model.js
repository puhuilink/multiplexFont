/* eslint-disable camelcase */
import hasura from '../hasura'

export class BaseModel {
  constructor () {
    this.schema = 'base'
  }

  find ({
    where = {},
    orderBy = { rest: 'asc' },
    limit = 9999,
    offset = 0
  }) {
    hasura(this.schema)
      .where(where)
      .orderBy(orderBy)
      .paginate(limit, offset)
      .query()
  }
}
