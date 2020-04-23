import HasuraORM from '../utils/hasura-orm'
class BaseDao {
  static _createHasuraORM () {
    return new HasuraORM(this.SCHEMA, this.PROVIDER)
  }

  static add (argus) {
    const hasuraORM = this._createHasuraORM()
    return hasuraORM.insert(argus)
  }

  static update (argus) {
    const hasuraORM = this._createHasuraORM()
    return hasuraORM.update(argus)
  }

  static find ({ where = {}, orderBy = {}, fields = [], limit = 0, offset = 0 }) {
    const hasuraORM = this._createHasuraORM()
    let chain = hasuraORM.where(where).orderBy(orderBy).select(fields)
    if (limit || offset) {
      chain = chain.paginate(limit, offset)
    }
    return chain
  }

  static batchDelete (argus) {
    const hasuraORM = this._createHasuraORM()
    return hasuraORM.delete(argus)
  }
}

export {
  BaseDao
}
