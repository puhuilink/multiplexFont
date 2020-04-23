import HasuraORM from './hasura-orm'
import { parse } from '@/api-hasura/utils/hasura-orm/graphql'

const mutate = async function () {
  // TODO: provider检测
  const hasuraORMList = await Promise.all(Array.from(arguments))
  const [{ provider }] = hasuraORMList
  const query = `mutation { ${hasuraORMList.map(hasuraORM => hasuraORM.parsed())} }`
  return provider.mutate({ mutation: parse(query) })
}

const query = async function () {
  // TODO: provider检测
  const hasuraInstanceList = await Promise.all(Array.from(arguments))
  const [{ provider }] = hasuraInstanceList
  const query = `query{ ${hasuraInstanceList.map(hasuraInstance => hasuraInstance.parsed())} }`
  return provider.query({ query: parse(query) })
}

export default HasuraORM

export {
  query,
  mutate
}
