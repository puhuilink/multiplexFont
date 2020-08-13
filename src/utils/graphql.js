// import _ from 'lodash'
import moment from 'moment'

const isAvailable = function (v) {
  if (Array.isArray(v)) {
    return !!v.length
  }
  if (typeof v === 'string') {
    return !!v.trim()
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
  if (typeof value === 'boolean') {
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
