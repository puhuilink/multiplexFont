import _ from 'lodash'
import moment from 'moment'

const isAvailable = function (v) {
  if (Array.isArray(v)) {
    return v.length
  }
  if (typeof v === 'string') {
    return v.trim()
  }
  return v !== undefined && v !== null
}

const generate = function ({ key, value }) {
  if (Array.isArray(value)) {
    if (value.length === 2 && value[1] instanceof moment) {
      return {
        [key]: {
          _gt: value[0].format('YYYY-MM-DDTHH:mm:ss'),
          _lt: value[1].format('YYYY-MM-DDTHH:mm:ss')
        }
      }
    }
  }
  if (typeof value === 'string') {
    return {
      [key]: {
        _ilike: `%${value.trim()}%`
      }
    }
  }
  if (typeof value === 'number') {
    return {
      [key]: {
        _eq: value
      }
    }
  }
  return {}
}

export const generateQuery = function (params = {}) {
  let obj = {}
  Object
    .entries(params)
    .filter(([key, value]) => isAvailable(value))
    .map(([key, value]) => generate({ key, value }))
    .forEach((v) => { obj = { ...obj, ...v } })
  return obj
}

const generateJsonb = function (key, { matchType, name, dataType, value }) {
  let _matchType
  let _value
  const _name = `'${name}'`
  switch (matchType) {
    case 'LIKE': {
      _matchType = 'LIKE'
      break
    }
    case 'EQ': {
      _matchType = '='
      break
    }
    default: {
      _matchType = matchType
      break
    }
  }

  // console.log(value)

  switch (dataType) {
    case 'STRING': {
      _value = matchType === 'LIKE' ? `'%${value}%'` : `'${value}'`
      break
    }
    case 'BOOLEAN': {
      _value = `'${Boolean(Number(value))}'`
      break
    }
    default: {
      _value = value
      break
    }
  }
  return `${key}->>${_name} ${_matchType} ${_value}`
}

export const generateJsonbQuery = function (fields = {}) {
  const obj = {}
  for (const [key, subFields] of Object.entries(fields)) {
    obj[key] = subFields
      .filter(({ value }) => isAvailable(value))
      .map(subField => generateJsonb(key, subField))
      .join(' AND ')
  }

  return _.pickBy(obj, v => !_.isEmpty(v))

  // console.log(fields)
  // Object
  // .entries(fields)

  // console.dir(
  //   Object.entries(fields)
  // )
  // return Object
  //   .entries(fields)
  //   .filter(([ key, subField ]) => isAvailable(subField.value))
  // .map(([key, subField]) => ([key, subField]))
  // .filter(([, { value }]) => isAvailable(value))
  // .map(([key, field]) => generateJsonb(key, field))
  // .join(' AND ')
}
