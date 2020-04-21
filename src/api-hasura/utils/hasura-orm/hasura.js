"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("./helper");
var hasura_orm_1 = require("./hasura-orm");
var graphql  = require('@/api-hasura/utils/hasura-orm/graphql')
var Hasura = /** @class */ (function () {
    function Hasura(schema, provider, _with, _fields, _schemaArguments, _alias) {
        if (provider === void 0) { provider = {}; }
        if (_with === void 0) { _with = ''; }
        if (_fields === void 0) { _fields = ''; }
        if (_schemaArguments === void 0) { _schemaArguments = {}; }
        if (_alias === void 0) { _alias = ''; }
        this._fields = '';
        this._paginate = '';
        this._alias = '';
        this._where = {};
        this._schemaArguments = {};
        this._with = '';
        this._compose = '';
        this.provider = {};
        this.provider = provider;
        this._schema = schema;
        this._with = _with;
        this._fields = _fields;
        this._schemaArguments = _schemaArguments;
        this._alias = _alias;
    }
    Object.defineProperty(Hasura.prototype, "schemaArguments", {
        get: function () {
            return helper_1.stringify(this._schemaArguments);
        },
        enumerable: true,
        configurable: true
    });
    Hasura.prototype.select = function (fields) {
        if (Array.isArray(fields)) {
            this._fields += ' ' + fields.join(',').replace(/,/g, ' ');
        } else {
            this._fields += ' ' + fields.replace(/,/g, ' ');
        }
        return this;
    };
    Hasura.prototype.alias = function (alias) {
        this._alias = alias + ":";
        return this;
    };
    Hasura.prototype.addArg = function (type, value) {
        var _a;
        this._schemaArguments = Object.assign(this._schemaArguments, (_a = {}, _a[type] = value, _a));
    };
    Hasura.prototype.limit = function (limit) {
        this.addArg('limit', limit);
        return this;
    };
    Hasura.prototype.offset = function (offset) {
        this.addArg('offset', offset);
        return this;
    };
    Hasura.prototype.distinct = function (distinct) {
        this.addArg('distinct_on', distinct);
        return this;
    };
    Hasura.prototype.orderBy = function (orderBy) {
        this.addArg('order_by', orderBy);
        return this;
    };
    Hasura.prototype.compose = function (schema, callback) {
        var qr = callback(new hasura_orm_1.default(schema, this.provider));
        this._compose += qr.parsed();
        return this;
    };
    // 批量查询支持
    Hasura.prototype.batchQuery = function () {
        const hasuraInstanceList = Array.from(arguments)
        // hasuraInstanceList.forEach(hasuraInstance => {
        //     console.log(hasuraInstance.provider, 'provider')
        // })
        const isSameProvider = hasuraInstanceList.reduce((pre, next) => pre.provider === next.provider)
        if (!isSameProvider) {
            throw new Error('批量查询需要同一provider')
        }
        const [{ provider }] = hasuraInstanceList
        const query = `query{
            ${hasuraInstanceList.map(hasuraInstance => hasuraInstance.parsed())}
        }`
        console.log(query)
        return provider.query({ query: graphql.parse(query) })
    },
    Hasura.prototype.where = function (condition) {
        Object.keys(condition).map(function (con) {
            if (typeof condition[con] !== 'object' && condition[con][0] !== '_') {
                condition[con] = {
                    _eq: condition[con]
                };
            }
        });
        this._where = Object.assign(this._where, condition);
        this._schemaArguments = Object.assign(this._schemaArguments, { where: this._where });
        return this;
    };
    Hasura.prototype.with = function (schema, callback) {
        var qr = callback(new Hasura(schema, this.provider));
        this._with += qr.parsed();
        return this;
    };
    Hasura.prototype.parsed = function () {
        if (!this._fields) {
            this._fields = 'id';
        }
        return this._paginate + " " + this._alias + this._schema + " " + (Object.keys(this._schemaArguments).length > 0
            ? '(' + helper_1.stringify(this._schemaArguments) + ')'
            : '') + "{  " + this.getFields() + " }";
    };
    // 前端固定数据格式
    // Hasura.prototype.parsed = function () {
    //     if (!this._fields) {
    //         this._fields = 'id';
    //     }
    //     return this._paginate + " " + "data: " + this._alias + this._schema + " " + (Object.keys(this._schemaArguments).length > 0
    //         ? '(' + helper_1.stringify(this._schemaArguments) + ')'
    //         : '') + "{  " + this.getFields() + " }";
    // };
    Hasura.prototype.getFields = function () {
        return this._fields + " " + this._with;
    };
    Hasura.prototype.paginate = function (limit, offset) {
        delete this._schemaArguments['limit'];
        delete this._schemaArguments['offset'];
        var args = helper_1.stringify(this._schemaArguments);
        if (args) {
            args = "(" + helper_1.stringify(this._schemaArguments) + ")";
        }
        this._paginate = " " + this._schema + "_aggregate" + args + " {\n      aggregate {\n        count\n      }\n    }";
        this.limit(limit);
        this.offset(offset);
        return this;
    };
    // 前端固定数据格式
    // Hasura.prototype.paginate = function (limit, offset) {
    //     delete this._schemaArguments['limit'];
    //     delete this._schemaArguments['offset'];
    //     var args = helper_1.stringify(this._schemaArguments);
    //     if (args) {
    //         args = "(" + helper_1.stringify(this._schemaArguments) + ")";
    //     }
    //     // this._schema = "data: " + this._schema
    //     this._paginate = " pagination:" + this._schema + "_aggregate" + args + " {\n      aggregate {\n        count\n      }\n    }";
    //     this.limit(limit);
    //     this.offset(offset);
    //     return this;
    // };
    Hasura.prototype.query = function () {
        return "query {  " + this.parsed() + " " + this._compose + " }";
    };
    Hasura.prototype.subscriptionQuery = function () {
        return "subscription {  " + this.parsed() + " " + this._compose + " }";
    };
    Hasura.prototype.get = function (cache) {
        if (cache === void 0) { cache = true; }
        return this.provider.get({ query: this.query() }, cache);
    };
    Hasura.prototype.await = function (cache) {
        if (cache === void 0) { cache = true; }
        // return this.provider.query({ query: this.query() }, (cache = true));
        return this.provider.query({ query: graphql.parse(this.query()) }, (cache = true));
    };
    Hasura.prototype.subscription = function () {
        return this.provider.subscription({ query: this.subscriptionQuery() });
    };
    return Hasura;
}());
exports.default = Hasura;
//# sourceMappingURL=hasura.js.map