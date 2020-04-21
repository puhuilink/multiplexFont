// import HasuraORM from '../utils/hasura-orm'

export const SchemaDecorator = {
  provider (v) {
    return function (target, name, descriptor) {
      Object.defineProperty(target, 'provider', {
        get () {
          return v
        }
      })
    }
  },
  schema (v = '') {
    return function (target, name, descriptor) {
      // const { provider, schema } = target
      Object.defineProperty(target, 'schema', {
        get () {
          return v
        }
      })
      // Object.defineProperty(target, 'hasuraORM', {
      //   get () {
      //     return new HasuraORM(schema, provider)
      //   }
      // })
    }
  }
}
