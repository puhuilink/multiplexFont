/* eslint-disable no-useless-escape */
export function stringify (object, trim = true) {
  let res = JSON.stringify(object)
    .replace(/(\"order_by\":\{\"[\w]+\":)\"([^"]+)\"/g, '$1$2')
    .replace(/(\"distinct_on\":)\"([^"]+)\"/g, '$1$2')
    .replace(/\"([^"]+)\":/g, '$1:')
  if (trim) {
    res = res.replace(/\uFFFF/g, '\\"').replace(/^.|.$/g, '')
  }
  return res
}
export function hasRelation (value) {
  Object.keys(value).map((key) => {
    if (typeof value[key] === 'object' && value.objects) {
      return value
    } else if (Array.isArray(value[key])) {
      value[key] = { data: value[key] }
    }
    return value
  })
  return value
}
