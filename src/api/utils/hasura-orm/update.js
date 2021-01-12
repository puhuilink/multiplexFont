import Hasura from './hasura'
import Insert from './insert'
import { stringify } from './helper'
import { parse } from 'graphql'

let index = 0

export default class Update extends Hasura {
  constructor (_schema, provider = {}, _with, _fields, _schemaArguments) {
    super('update_' + _schema, provider, _with, _fields, _schemaArguments)
    this._set = ''
  }

  /**
   * 更新入参
   * @param  {Object} args 更新的内容
   * @return {HasuraORM} this
   */
  update (...args) {
    args.forEach(value => {
      this._set += stringify(value)
    })
    return this
  }

  /**
   * 执行 graphql  mutation 语句
   * @return {Promise<any>}
   */
  mutate () {
    return this.provider.mutate({ query: parse(this.query()) })
  }

  insert (schema, callback) {
    const qr = callback(new Insert(schema, this.provider))
    this._compose += qr.parsed()
    return this
  }

  /**
   * 生成 graphql 语句体
   * @return {String}
   */
  parsed () {
    if (Object.keys(this._where).length === 0) {
      throw new Error('where condition need')
    }
    const args = this.schemaArguments + '_set: {' + this._set + '} '
    // return ` ${this._schema} ${'(' + args + ' )'}{ ${this._fields ? ' returning { ' + this.getFields() + ' }' : 'affected_rows'} }`
    // 若一条 mutation 中出现相同 schema, 根据 alias 可避免冲突
    // mutation 不关注返回值，因此 alias 无需人工指定
    const alias = `${this._schema}${index++}`
    return `${alias}: ${this._schema} ${'(' + args + ' )'} { affected_rows }`
  }

  /**
   * 生成最终执行的 graphql 语句
   * @return {String}
   */
  query () {
    return `mutation { ${this._compose}  ${this.parsed()} } `
  }
}
