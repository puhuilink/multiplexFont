import Hasura from './hasura'
// eslint-disable-next-line no-unused-vars
import { stringify, hasRelation } from './helper'
import { parse } from 'graphql'

export default class Insert extends Hasura {
  constructor (_schema, provider = {}, _with = '', _fields = '', _schemaArguments = {}) {
    super('insert_' + _schema, provider, _with, _fields, _schemaArguments)
    this._object = ''
    this._batch = false
  }

  /**
   * 插入入参
   * @param  {Object} args 的内容
   * @return {HasuraORM} this
   */
  insert (args) {
    if (!args.on_conflict || !args.objects) {
      this._batch = true
    }
    this._object += stringify(
      args,
      // hasRelation(args),
      !this._batch
    ) + ' , '
    return this
  }

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
    const args = this.schemaArguments + this._object
    let schemaArgs = '(' + args + ')'
    if (this._batch) {
      schemaArgs = args[0] === '[' ? '(objects:' + args + ')' : '(objects:[' + args + '])'
    }
    return ` ${this._schema} ${schemaArgs} {  ${this._fields ? ' returning { ' + this.getFields() + ' }' : 'affected_rows'} }`
  }

  /**
   * 生成最终执行的 graphql 语句
   * @return {String}
   */
  query () {
    return `mutation {  ${this.parsed()}  }`
  }
}
