import Hasura from 'hasura-orm'
import provider from '@/utils/apollo'

export default function hasura (schema) {
  Hasura.provider = provider
  const orm = new Hasura(schema)
  orm.provider = provider
  return orm
}
