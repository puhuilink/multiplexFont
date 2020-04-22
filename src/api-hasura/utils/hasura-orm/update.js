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
var insert_1 = require("./insert");
var helper_1 = require("./helper");
var graphql = require('graphql')
var Update = /** @class */ (function (_super) {
    __extends(Update, _super);
    function Update(_schema, provider, _with, _fields, _schemaArguments, _alias) {
        if (provider === void 0) { provider = {}; }
        if (_alias === void 0) { _alias = ''; }
        var _this = _super.call(this, 'update_' + _schema, provider, _with, _fields, _schemaArguments, _alias) || this;
        _this._set = '';
        return _this;
    }
    Update.prototype.update = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args.forEach(function (value) {
            _this._set += helper_1.stringify(value);
        });
        return this;
    };
    Update.prototype.mutate = function () {
        // console.dir(this)
        // console.log(this.query())
        return this.provider.mutate({ mutation: graphql.parse(this.query()) });
    };
    Update.prototype.insert = function (schema, callback) {
        var qr = callback(new insert_1.default(schema, this.provider));
        this._compose += qr.parsed();
        return this;
    };
    Update.prototype.parsed = function () {
        if (Object.keys(this._where).length === 0) {
            throw new Error('where condition need');
        }
        var args = this.schemaArguments + '_set: {' + this._set + '} ';
        return " " + this._alias + this._schema + " " + ('(' + args + ' )') + "{ " + (this._fields ? ' returning { ' + this.getFields() + ' }' : 'affected_rows') + " }";
    };
    Update.prototype.query = function () {
        return "mutation { " + this._compose + "  " + this.parsed() + " } ";
    };
    return Update;
}(hasura_1.default));
exports.default = Update;
//# sourceMappingURL=update.js.map