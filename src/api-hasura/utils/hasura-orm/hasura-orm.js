'use strict'
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p] }
    return extendStatics(d, b)
  }
  return function (d, b) {
    extendStatics(d, b)
    function __ () { this.constructor = d }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
  }
})()
Object.defineProperty(exports, '__esModule', { value: true })
var update_1 = require('./update')
var insert_1 = require('./insert')
var hasura_1 = require('./hasura')
var delete_1 = require('./delete')
var graphql = require('graphql')
var HasuraORM = /** @class */ (function (_super) {
  __extends(HasuraORM, _super)
  function HasuraORM (_schema, provider, _with, _fields, _schemaArguments, _alias) {
    if (provider === void 0) { provider = {} }
    if (_with === void 0) { _with = '' }
    if (_fields === void 0) { _fields = '' }
    if (_schemaArguments === void 0) { _schemaArguments = {} }
    if (_alias === void 0) { _alias = '' }
    return _super.call(this, _schema, provider, _with, _fields, _schemaArguments, _alias) || this
  }
  HasuraORM.prototype.insert = function (args) {
    return new insert_1.default(this._schema, this.provider, this._with, this._fields, this._schemaArguments, this._alias).insert(args)
  }
  HasuraORM.prototype.update = function (args) {
    return new update_1.default(this._schema, this.provider, this._with, this._fields, this._schemaArguments, this._alias).update(args)
  }
  HasuraORM.prototype.delete = function (args) {
    return new delete_1.default(this._schema, this.provider, this._with, this._fields, this._schemaArguments, this._alias).delete(args)
  }
  return HasuraORM
}(hasura_1.default))
exports.default = HasuraORM
// # sourceMappingURL=hasura-orm.js.map
