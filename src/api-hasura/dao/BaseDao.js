import { SchemaDecorator } from '../decorator'
import { alert } from '@/utils/clientConfig'
import HasuraORM from '../utils/hasura-orm'

const { provider, schema } = SchemaDecorator

@schema('base')
@provider(alert)
class BaseDao {
  static find ({ where = {}, orderBy = {}, fields = [], limit = 1, offset = 0 }) {
    console.dir(this)
    // const { hasuraORM } = this
    const hasuraORM = new HasuraORM(this.schema, this.provider)
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
