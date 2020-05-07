import Hasura from './hasura'
import { stringify } from './helper'
import { parse } from 'graphql'

export default class JsonB extends Hasura {
  constructor (_schema, provider = {}, _with, _fields, _schemaArguments) {
    super('update_' + _schema, provider, _with, _fields, _schemaArguments)
    this._set = ''
  }

  // append json value to a jsonb column
  append (...args) {
    this._set = `_append: {
      ${args.map(val => stringify(val))}
    }`
    return this
  }

  // prepend json value to a jsonb column
  prepend () { }

  // delete top-level key from jsonb column
  deleteKey () {}

  // delete array element from jsonb column
  deleteElem () {}

  // delete element at a path from jsonb column
  deleteAtPath () {}

  /**
   * 执行 graphql  mutation 语句
   * @return {Promise<any>}
   */
  mutate () {
    return this.provider.mutate({ query: parse(this.query()) })
  }

  /**
   * 生成 graphql 语句体
   * @return {String}
   */
  parsed () {
    if (Object.keys(this._where).length === 0) {
      throw new Error('where condition need')
    }
    const args = this.schemaArguments + ' ' + this._set
    return ` ${this._schema} ${'(' + args + ' )'}{ ${this._fields ? ' returning { ' + this.getFields() + ' }' : 'affected_rows'} }`
  }

  /**
   * 生成最终执行的 graphql 语句
   * @return {String}
   */
  query () {
    return `mutation { ${this._compose}  ${this.parsed()} } `
  }
}
