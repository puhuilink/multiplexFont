// export * from './hasura-orm'
import hasuraOrm from './hasura-orm'
const { batchQuery, batchMutate } = hasuraOrm.prototype

export default hasuraOrm
export {
  batchQuery,
  batchMutate
}