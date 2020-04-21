import store from '@/store'
import moment from 'moment'

const { getters } = store

/**
 * 默认创建人与时间戳
 * @param {String} format moment format
 * @return {Object}
 */
const defaultCreateInfo = function (format = 'YYYY-MM-DDTHH:mm:ss') {
  return {
    creator: getters.userId,
    createdate: moment().format(format)
  }
}

/**
 * 默认更新人与时间戳
 * @param {String} format moment format
 * @return {Object}
 */
const defaultUpdateInfo = function (format = 'YYYY-MM-DDTHH:mm:ss') {
  return {
    updator: getters.userId,
    updatedate: moment().format(format)
  }
}

export {
  defaultCreateInfo,
  defaultUpdateInfo
}
