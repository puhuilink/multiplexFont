// fork form
// https://github.com/timeshift92/hasura-orm

import HasuraORM from './hasura-orm'
import { parse } from 'graphql'

/**
 * 执行一条或多条操作
 * @param {Promise<HasuraORM>}
 * @return {Promise<any>}
 */
const mutate = async function () {
  const hasuraORMList = await Promise.all(Array.from(arguments))
  const [{ provider }] = hasuraORMList
  const query = `mutation { ${hasuraORMList.map(hasuraORM => hasuraORM.parsed())} }`
  return provider.mutate({ mutation: parse(query) })
}

/**
 * 合并一条或多条操作的query
 * @return {Promise<String>}
 */
const generateQuery = async function () {
  const hasuraInstanceList = await Promise.all(Array.from(arguments))
  return `query{ ${hasuraInstanceList.map(hasuraInstance => hasuraInstance.parsed())} }`
}

/**
 * 执行一条或多条查询
 * @param {Promise<HasuraORM>}
 * @return {Promise<any>}
 */
const query = async function () {
  const hasuraInstanceList = await Promise.all(Array.from(arguments))
  const [{ provider }] = hasuraInstanceList
  const query = `query{ ${hasuraInstanceList.map(hasuraInstance => hasuraInstance.parsed())} }`
  return provider.query({ query: parse(query) })
}

export default HasuraORM

export {
  generateQuery,
  query,
  mutate
}
