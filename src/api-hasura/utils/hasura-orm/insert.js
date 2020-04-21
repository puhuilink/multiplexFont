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
var hasura_1 = require("./hasura");
var helper_1 = require("./helper");
var Insert = /** @class */ (function (_super) {
    __extends(Insert, _super);
    function Insert(_schema, provider, _with, _fields, _schemaArguments, _alias) {
        if (provider === void 0) { provider = {}; }
        if (_with === void 0) { _with = ''; }
        if (_fields === void 0) { _fields = ''; }
        if (_schemaArguments === void 0) { _schemaArguments = {}; }
        if (_alias === void 0) { _alias = ''; }
        var _this = _super.call(this, 'insert_' + _schema, provider, _with, _fields, _schemaArguments, _alias) || this;
        _this._object = '';
        _this._batch = false;
        return _this;
    }
    Insert.prototype.insert = function (args) {
        if (!args.on_conflict || !args.objects) {
            this._batch = true;
        }
        this._object += helper_1.stringify(helper_1.hasRelation(args), !this._batch) + ' , ';
        return this;
    };
    Insert.prototype.mutate = function () {
        return this.provider.mutate({ query: this.query() });
    };
    Insert.prototype.parsed = function () {
        var args = this.schemaArguments + this._object;
        var schemaArgs = '(' + args + ')';
        if (this._batch) {
            schemaArgs = args[0] === '[' ? '(objects:' + args + ')' : '(objects:[' + args + '])';
        }
        return " " + this._alias + this._schema + " " + schemaArgs + " {  " + (this._fields ? ' returning { ' + this.getFields() + ' }' : 'affected_rows') + " }";
    };
    Insert.prototype.query = function () {
        return "mutation {  " + this.parsed() + "  }";
    };
    return Insert;
}(hasura_1.default));
exports.default = Insert;
//# sourceMappingURL=insert.js.map