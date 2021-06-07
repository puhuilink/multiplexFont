import Update from './update'
import Insert from './insert'
import Hasura from './hasura'
import Delete from './delete'
export default class HasuraORM extends Hasura {
  constructor (_schema, provider = {}, _with = '', _fields = '', _schemaArguments = {}, _distinct = '') {
    super(_schema, provider, _with, _fields, _schemaArguments)
  }
  insert (args) {
    return new Insert(this._schema, this.provider, this._with, this._fields, this._schemaArguments).insert(args)
  }
  update (args) {
    return new Update(this._schema, this.provider, this._with, this._fields, this._schemaArguments).update(args)
  }
  delete (args) {
    return new Delete(this._schema, this.provider, this._with, this._fields, this._schemaArguments).delete(args)
  }
}
