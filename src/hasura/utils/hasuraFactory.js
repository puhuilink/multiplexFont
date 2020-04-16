// import Hasura from './hasura-orm/hasura-orm'
import Hasura from './hasura-orm'

export class HasuraFactory {
  static create (client) {
    return function hasura (schema) {
      Hasura.provider = client
      const orm = new Hasura(schema)
      orm.provider = client
      return orm
    }
  }
}
