import HasuraORM from '../hasura-orm'

const provider = function (v) {
  return function (target, name, descriptor) {
    Object.defineProperty(target, 'provider', {
      get () {
        return v
      }
    })
  }
}

const schema = function (v = '') {
  return function (target, name, descriptor) {
    const { provider, schema } = target
    Object.defineProperty(target, 'schema', {
      get () {
        return v
      }
    })
    Object.defineProperty(target, 'hasuraORM', {
      get () {
        return new HasuraORM(schema, provider)
      }
    })
  }
}

export {
  provider,
  schema
}
