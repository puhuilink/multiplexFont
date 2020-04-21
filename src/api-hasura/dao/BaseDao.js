class BaseDao {
  static add () {}

  static update () {}

  static find ({ where = {}, orderBy = {}, fields = [], limit = 1, offset = 0 }) {
    const { hasuraORM } = this
    let chain = hasuraORM.where(where).orderBy(orderBy).select(fields)
    if (limit || offset) {
      chain = chain.paginate(limit, offset)
    }
    return chain
  }

  static batchDelete () {
    const { hasuraORM } = this
    return hasuraORM.delete(arguments)
  }
}

export {
  BaseDao
}
