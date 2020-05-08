import Update from './update'
import Insert from './insert'
import Hasura from './hasura'
import Delete from './delete'
import JsonB from './jsonb'
export default class HasuraORM extends Hasura {
  constructor (_schema, provider = {}, _with = '', _fields = '', _schemaArguments = {}) {
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

  // 以下为 jsonb 操作
  append (args) {
    return new JsonB(this._schema, this.provider, this._with, this._fields, this._schemaArguments).append(args)
  }
  prepend (args) {
    return new JsonB(this._schema, this.provider, this._with, this._fields, this._schemaArguments).prepend(args)
  }
  deleteKey (args) {
    return new JsonB(this._schema, this.provider, this._with, this._fields, this._schemaArguments).deleteKey(args)
  }
  deleteElem (args) {
    return new JsonB(this._schema, this.provider, this._with, this._fields, this._schemaArguments).deleteElem(args)
  }
  deleteAtPath (args) {
    return new JsonB(this._schema, this.provider, this._with, this._fields, this._schemaArguments).deleteAtPath(args)
  }
}
