// import Hasura from './hasura-orm/hasura-orm'
import Hasura from './hasura-orm'

export class HasuraFactory {
  static create (client) {
    return function hasura (schema) {
      const orm = new Hasura(schema, client)
      return orm
    }
  }
}
