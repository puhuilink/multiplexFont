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
    Object.defineProperty(target, 'schema', {
      get () {
        return v
      }
    })
    const { provider, schema } = target
    Object.defineProperty(target, 'hasuraORM', {
      get () {
        // 运行时产生新实例
        return new HasuraORM(schema, provider)
      }
    })
  }
}

const primaryKey = function (v) {
  return function (target, name, descriptor) {
    Object.defineProperty(target, 'primaryKey', {
      get () {
        return v
      }
    })
  }
}

export {
  provider,
  primaryKey,
  schema
}
