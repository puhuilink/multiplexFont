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
    // TODO: alias 放置于构造函数
    this._alias = ''
  }
  get schemaArguments () {
    return stringify(this._schemaArguments)
  }
  select (fields) {
    if (Array.isArray(fields)) {
      this._fields = fields.filter(v => !!v).join(',').replace(/,/g, ' ')
      // this._fields += ' ' + fields.join(',').replace(/,/g, ' ')
    } else {
      this._fields = fields.replace(/,/g, ' ')
      // this._fields += ' ' + fields.replace(/,/g, ' ')
    }
    return this
  }
  addArg (type, value) {
    this._schemaArguments = Object.assign(this._schemaArguments, { [type]: value })
  }
  limit (limit) {
    this.addArg('limit', limit)
    return this
  }
  offset (offset) {
    this.addArg('offset', offset)
    return this
  }
  distinct (distinct) {
    this.addArg('distinct_on', distinct)
    return this
  }
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
    // TODO
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
  alias (alias) {
    this._alias = alias + ':'
    return this
  }
}
