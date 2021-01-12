import moment from 'moment'

export const formatTime = function (time) {
  return time ? moment(time).format() : ''
}

const isValueAvailable = function (val) {
  if (Array.isArray(val)) return !!val.length
  if (typeof val === 'string') return !!val.trim()
  return val !== undefined && val !== null
}

/**
 * 生成 GraphQL where 某一项的表达式
 * @param {*} param0
 */
const generateItemExpression = function ({ key, value }) {
  let expression = {}
  switch (Object.prototype.toString.call(value)) {
    case '[object Array]':
      const [start, end] = value
      if (start instanceof moment && end instanceof moment) {
        expression = {
          [key]: {
            _gt: start.format('YYYY-MM-DDTHH:mm:ss'),
            _lt: end.format('YYYY-MM-DDTHH:mm:ss')
          }
        }
      }
      break
    case '[object String]':
      expression = { [key]: { _ilike: `%${value.trim()}%` } }
      break
    case '[object Number]':
      expression = { [key]: { _eq: value } }
      break
    case '[object Boolean]':
      expression = { [key]: { _eq: value } }
      break

    default: break
  }

  return expression
}

/**
 * 生成 GraphQL where 查询语句
 * @param {*} params
 */
export const generateQuery = function (params = {}) {
  const where = {}
  Object
    .entries(params)
    .filter(([key, value]) => isValueAvailable(value))
    .map(([key, value]) => generateItemExpression({ key, value }))
    .forEach((expression) => { Object.assign(where, expression) })
  return where
}
