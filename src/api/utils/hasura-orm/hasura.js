import { stringify } from './helper'
import HasuraORM from './hasura-orm'
import { parse } from 'graphql'

export default class Hasura {
  constructor (schema, provider = {}, _with = '', _fields = '', _schemaArguments = {}) {
    this._fields = ''
    this._paginate = ''
    this._where = {}
    this._schemaArguments = {}
    this._with = ''
    this._compose = ''
    this.provider = {}
    this.provider = provider
    this._schema = schema
    this._with = _with
    this._fields = _fields
    this._schemaArguments = _schemaArguments
    this._alias = ''
    this._distinct = ''
  }

  get schemaArguments () {
    return stringify(this._schemaArguments)
  }

  /**
   * 要查询的字段
   * @param {Array<String>} fields 要查询的字段，传入 undefined 或 null 等空值会被忽略
   * @return {Hasura} this
   */
  select (fields = []) {
    const _fields = fields.length ? fields : this._fields
    this._fields = _fields.filter(v => !!v).join(',').replace(/,/g, ' ')
    return this
  }

  addArg (type, value) {
    this._schemaArguments = Object.assign(this._schemaArguments, { [type]: value })
  }

  /**
   * 查询数量
   * @param {*} limit
   */
  limit (limit) {
    this.addArg('limit', limit)
    return this
  }

  /**
   * 偏移量
   * @param {*} offset
   */
  offset (offset) {
    this.addArg('offset', offset)
    return this
  }

  /**
   * 聚合查询
   * @param {*} distinct
   */
  distinct (distinct) {
    this._distinct = Object.assign(this._distinct, distinct)
    this._schemaArguments = Object.assign(this._schemaArguments, { 'distinct_on': distinct })
    this.addArg('distinct_on', distinct)
    return this
  }

  /**
   * 排序字段
   * @param {*} orderBy
   */
  orderBy (orderBy) {
    this.addArg('order_by', orderBy)
    return this
  }

  compose (schema, callback) {
    const qr = callback(new HasuraORM(schema, this.provider))
    this._compose += qr.parsed()
    return this
  }

  where (condition) {
    Object.keys(condition).map(con => {
      if (typeof condition[con] !== 'object' && condition[con][0] !== '_') {
        condition[con] = {
          _eq: condition[con]
        }
      }
    })
    this._where = Object.assign(this._where, condition)
    console.log('where', this._where)
    this._schemaArguments = Object.assign(this._schemaArguments, { where: this._where })
    return this
  }

  with (schema, callback) {
    const qr = callback(new Hasura(schema, this.provider))
    this._with += qr.parsed()
    return this
  }

  parsed () {
    if (!this._fields) {
      this._fields = 'id'
    }
    // console.log('parse', `${this._paginate} ${this._alias} ${this._schema} ${Object.keys(this._schemaArguments).length > 0
    //   ? '(' + stringify(this._schemaArguments) + ')'
    //   : ''}{  ${this.getFields()} }`)
    return `${this._paginate} ${this._alias} ${this._schema} ${Object.keys(this._schemaArguments).length > 0
      ? '(' + stringify(this._schemaArguments) + ')'
      : ''}{  ${this.getFields()} }`
  }

  getFields () {
    return `${this._fields} ${this._with}`
  }

  paginate (limit, offset) {
    delete this._schemaArguments['limit']
    delete this._schemaArguments['offset']
    let args = stringify(this._schemaArguments)
    if (args) {
      args = `(${stringify(this._schemaArguments)})`
    }
    // this._paginate = ` ${this._schema}_aggregate${args} {
    //   aggregate {
    //     count
    //   }
    // }`
    this._paginate = `pagination: ${this._schema}_aggregate${args} {
      aggregate {
        count
      }
    }`
    this.limit(limit)
    this.offset(offset)
    return this
  }

  query () {
    return `query {  ${this.parsed()} ${this._compose} }`
  }

  subscriptionQuery () {
    return `subscription {  ${this.parsed()} ${this._compose} }`
  }

  get (cache = true) {
    return this.provider.get({ query: this.query() }, cache)
  }

  /**
   * 执行 graphql query 语句
   * @return {Promise<any>}
   */
  await (cache = true) {
    return this.provider.query({ query: parse(this.query()) }, (cache = true))
  }

  subscription () {
    return this.provider.subscription({ query: this.subscriptionQuery() })
  }

  async max (field) {
    const { data } = await this.provider.query({ query: parse(`{
      ${this._schema}_aggregate {
        aggregate {
          max {
            ${field}
          }
        }
      }
    }`)
    })
    return data[`${this._schema}_aggregate`]['aggregate']['max'][field]
  }

  /**
   * 为返回值指定别名
   * @param {String} alias
   * @return {HasuraORM} this
   */
  alias (alias) {
    this._alias = alias + ':'
    return this
  }
}
