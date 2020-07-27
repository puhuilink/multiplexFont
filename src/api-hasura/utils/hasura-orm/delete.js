import Hasura from './hasura'
import { parse } from 'graphql'

export default class Delete extends Hasura {
  constructor (_schema, provider = {}, _with, _fields, _schemaArguments) {
    super('delete_' + _schema, provider, _with, _fields, _schemaArguments)
  }

  /**
   * 删除入参
   * @param {Where} condition
   * @return {HasuraORM} this
   */
  delete (condition) {
    return this.where(condition)
  }

  /**
   * 生成 graphql 语句体
   * @return {String}
   */
  parsed () {
    return ` ${this._schema} ${'(' + this.schemaArguments + ' )'}{ ${
      // this._fields ? ' returning { ' + this._fields + ' }' : 'affected_rows'
      'affected_rows'
    } }`
  }

  /**
   * 执行 graphql  mutation 语句
   * @return {Promise<any>}
   */
  mutate () {
    return this.provider.mutate({ query: parse(this.query()) })
  }

  /**
   * 生成最终执行的 graphql 语句
   * @return {String}
   */
  query () {
    return `mutation { ${this.parsed()} ${this._compose} } `
  }
}
