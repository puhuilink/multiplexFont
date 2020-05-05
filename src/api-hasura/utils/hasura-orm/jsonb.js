import Hasura from './hasura'
import { stringify } from './helper'
import { parse } from 'graphql'

// _append	||	append json value to a jsonb column
// _prepend	||	prepend json value to a jsonb column
// _delete_key	-	delete top-level key from jsonb column
// _delete_elem	-	delete array element from jsonb column
// _delete_at_path	#-	delete element at a path from jsonb column

export default class JsonB extends Hasura {
  constructor (_schema, provider = {}, _with, _fields, _schemaArguments) {
    super('update_' + _schema, provider, _with, _fields, _schemaArguments)
    this._set = ''
  }
  append (...args) {
    this._set = `_append: {
      ${args.map(val => stringify(val))}
    }`
    return this
  }
  prepend () {}
  deleteKey () {}
  deleteElem () {}
  deleteAtPath () {}

  mutate () {
    return this.provider.mutate({ query: parse(this.query()) })
  }
  parsed () {
    if (Object.keys(this._where).length === 0) {
      throw new Error('where condition need')
    }
    const args = this.schemaArguments + ' ' + this._set
    return ` ${this._schema} ${'(' + args + ' )'}{ ${this._fields ? ' returning { ' + this.getFields() + ' }' : 'affected_rows'} }`
  }
  query () {
    return `mutation { ${this._compose}  ${this.parsed()} } `
  }
}
