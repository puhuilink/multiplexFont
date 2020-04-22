import HasuraORM from '../utils/hasura-orm'
class BaseDao {
  static createHasuraORM () {
    return new HasuraORM(this.schema, this.provider)
  }

  static add (argus) {
    const hasuraORM = this.createHasuraORM()
    return hasuraORM.insert(argus)
  }

  static update (argus) {
    const hasuraORM = this.createHasuraORM()
    return hasuraORM.update(argus)
  }

  static find ({ where = {}, orderBy = {}, fields = [], limit = 0, offset = 0 }) {
    const hasuraORM = this.createHasuraORM()
    let chain = hasuraORM.where(where).orderBy(orderBy).select(fields)
    if (limit || offset) {
      chain = chain.paginate(limit, offset)
    }
    return chain
  }

  // eslint-disable-next-line no-empty-pattern
  static batchDelete ({}) {
    const hasuraORM = this.createHasuraORM()
    return hasuraORM.delete(arguments)
  }
}

export {
  BaseDao
}
