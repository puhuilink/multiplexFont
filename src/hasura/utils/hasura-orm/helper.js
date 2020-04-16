"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stringify(object, trim) {
    if (trim === void 0) { trim = true; }
    var res = JSON.stringify(object)
        .replace(/(\"order_by\":\{\"[\w]+\":)\"([^"]+)\"/g, '$1$2')
        .replace(/((\"distinct_on\"|\"constraint\"):)\"([^"]+)\",/g, '$1$3,')
        .replace(/\"([^"]+)\":/g, '$1:');
    if (trim) {
        res = res.replace(/\uFFFF/g, '\\"').replace(/^.|.$/g, '');
    }
    return res;
}
exports.stringify = stringify;
function hasRelation(value) {
    Object.keys(value).map(function (key) {
        if (typeof value[key] === 'object' && value.objects) {
            return value;
        }
        else if (Array.isArray(value[key])) {
            value[key] = { data: value[key] };
        }
        return value;
    });
    return value;
}
exports.hasRelation = hasRelation;
//# sourceMappingURL=helper.js.map