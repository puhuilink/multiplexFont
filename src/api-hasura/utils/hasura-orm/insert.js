import Hasura from './hasura'
import { stringify, hasRelation } from './helper'
import { parse } from 'graphql'

export default class Insert extends Hasura {
  constructor (_schema, provider = {}, _with = '', _fields = '', _schemaArguments = {}) {
    super('insert_' + _schema, provider, _with, _fields, _schemaArguments)
    this._object = ''
    this._batch = false
  }
  insert (args) {
    if (!args.on_conflict || !args.objects) {
      this._batch = true
    }
    this._object += stringify(hasRelation(args), !this._batch) + ' , '
    return this
  }
  mutate () {
    return this.provider.mutate({ query: parse(this.query()) })
  }
  parsed () {
    const args = this.schemaArguments + this._object
    let schemaArgs = '(' + args + ')'
    if (this._batch) {
      schemaArgs = args[0] === '[' ? '(objects:' + args + ')' : '(objects:[' + args + '])'
    }
    return ` ${this._schema} ${schemaArgs} {  ${this._fields ? ' returning { ' + this.getFields() + ' }' : 'affected_rows'} }`
  }
  query () {
    return `mutation {  ${this.parsed()}  }`
  }
}
