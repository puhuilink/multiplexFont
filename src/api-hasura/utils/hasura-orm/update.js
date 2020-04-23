import Hasura from './hasura'
import Insert from './insert'
import { stringify } from './helper'
import { parse } from '@/api-hasura/utils/hasura-orm/graphql'

export default class Update extends Hasura {
  constructor (_schema, provider = {}, _with, _fields, _schemaArguments) {
    super('update_' + _schema, provider, _with, _fields, _schemaArguments)
    this._set = ''
  }
  update (...args) {
    args.forEach(value => {
      this._set += stringify(value)
    })
    return this
  }
  mutate () {
    return this.provider.mutate({ query: parse(this.query()) })
  }
  insert (schema, callback) {
    const qr = callback(new Insert(schema, this.provider))
    this._compose += qr.parsed()
    return this
  }
  parsed () {
    if (Object.keys(this._where).length === 0) {
      throw new Error('where condition need')
    }
    const args = this.schemaArguments + '_set: {' + this._set + '} '
    return ` ${this._schema} ${'(' + args + ' )'}{ ${this._fields ? ' returning { ' + this.getFields() + ' }' : 'affected_rows'} }`
  }
  query () {
    return `mutation { ${this._compose}  ${this.parsed()} } `
  }
}
