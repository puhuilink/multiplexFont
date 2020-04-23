import HasuraORM from './hasura-orm'
import { parse } from 'graphql'

/**
 * 执行一条或多条操作
 */
const mutate = async function () {
  // TODO: provider检测
  const hasuraORMList = await Promise.all(Array.from(arguments))
  const [{ provider }] = hasuraORMList
  const query = `mutation { ${hasuraORMList.map(hasuraORM => hasuraORM.parsed())} }`
  return provider.mutate({ mutation: parse(query) })
}

/**
 * 执行一条或多条查询
 */
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
