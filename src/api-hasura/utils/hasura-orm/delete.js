import Hasura from './hasura'
import { parse } from '@/api-hasura/utils/hasura-orm/graphql'

export default class Delete extends Hasura {
  constructor (_schema, provider = {}, _with, _fields, _schemaArguments) {
    super('delete_' + _schema, provider, _with, _fields, _schemaArguments)
  }
  delete (condition) {
    return this.where(condition)
  }
  parsed () {
    return ` ${this._schema} ${'(' + this.schemaArguments + ' )'}{ ${
      this._fields ? ' returning { ' + this._fields + ' }' : 'affected_rows'
    } }`
  }
  mutate () {
    return this.provider.mutate({ query: parse(this.query()) })
  }
  query () {
    return `mutation { ${this.parsed()} ${this._compose} } `
  }
}
