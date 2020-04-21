"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var graphql  = require('@/api-hasura/utils/hasura-orm/graphql')
var hasura_1 = require("./hasura");
var Delete = /** @class */ (function (_super) {
    __extends(Delete, _super);
    function Delete(_schema, provider, _with, _fields, _schemaArguments, _alias) {
        if (provider === void 0) { provider = {}; }
        if (_alias === void 0) { _alias = ''; }
        return _super.call(this, 'delete_' + _schema, provider, _with, _fields, _schemaArguments, _alias) || this;
    }
    Delete.prototype.delete = function (condition) {
        return this.where(condition);
    };
    Delete.prototype.parsed = function () {
        return " " + this._alias + this._schema + " " + ('(' + this.schemaArguments + ' )') + "{ " + (this._fields ? ' returning { ' + this._fields + ' }' : 'affected_rows') + " }";
    };
    Delete.prototype.mutate = function () {
        return this.provider.mutate({ mutation: graphql.parse(this.query()) });
    };
    Delete.prototype.query = function () {
        return "mutation { " + this.parsed() + " " + this._compose + " } ";
    };
    return Delete;
}(hasura_1.default));
exports.default = Delete;
//# sourceMappingURL=delete.js.map