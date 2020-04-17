/* eslint-disable camelcase */
import HasuraORM from '../utils/hasura-orm'
export class BaseModel {
  constructor () {
    this.schema = 'base'
    this.hasuraORM = new HasuraORM(this.schema, '')
  }

  find ({
    where = {},
    orderBy = {},
    fields = [],
    limit = 0,
    offset = 0
  }) {
    const v = this.hasuraORM
      .where(where)
      .orderBy(orderBy)
      .select(fields)
    if (limit || offset) {
      return v.paginate(limit, offset)
    } else {
      return v
    }
  }

  findOne (options) {
    return this
      .find(options)
      .paginate(1, 0)
  }

  delete (argus) {
    return this.hasuraORM.delete(argus)
  }
}
