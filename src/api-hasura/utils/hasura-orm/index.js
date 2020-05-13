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
  // TODO: provider检测
  const hasuraORMList = await Promise.all(Array.from(arguments))
  // console.log(hasuraORMList)
  const [{ provider }] = hasuraORMList
  const query = `mutation { ${hasuraORMList.map(hasuraORM => hasuraORM.parsed())} }`
  // console.log(query)pH
  return provider.mutate({ mutation: parse(query) })
}

/**
 * 执行一条或多条查询
 * @param {Promise<HasuraORM>}
 * @return {Promise<any>}
 */
const query = async function () {
  // TODO: provider检测
  const hasuraInstanceList = await Promise.all(Array.from(arguments))
  const [{ provider }] = hasuraInstanceList
  const query = `query{ ${hasuraInstanceList.map(hasuraInstance => {
    // console.log(hasuraInstance.parsed())
    return hasuraInstance.parsed()
  })} }`
  // console.log(query)
  return provider.query({ query: parse(query) })
}

export default HasuraORM

export {
  query,
  mutate
}
