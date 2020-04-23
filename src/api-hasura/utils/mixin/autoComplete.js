import store from '@/store'
import moment from 'moment'

const { getters } = store

/**
 * 默认创建人与时间戳
 * @param {Boolean} withPostfix 字段是否带下标
 * @return {Object}
 */
const defaultCreateDate = function (withPostfix = false) {
  return {
    [withPostfix ? 'creator_s' : 'creator']: getters.userId,
    [withPostfix ? 'createdate_t' : 'createdate']: moment().format('YYYY-MM-DDTHH:mm:ss')
  }
}

const defaultCreateTime = function (withPostfix = false) {
  return {
    [withPostfix ? 'creator_s' : 'creator']: getters.userId,
    [withPostfix ? 'createtime_t' : 'createtime']: moment().format('YYYY-MM-DDTHH:mm:ss')
  }
}

/**
 * 默认更新人与时间戳
 * @param {Boolean} withPostfix 字段是否带下标
 * @return {Object}
 */
const defaultUpdateDate = function (withPostfix = false) {
  return {
    [withPostfix ? 'updator_s' : 'updator']: getters.userId,
    [withPostfix ? 'updatedate_t' : 'updatedate']: moment().format('YYYY-MM-DDTHH:mm:ss')
  }
}

const defaultUpdateTime = function (withPostfix = false) {
  return {
    [withPostfix ? 'updator_s' : 'updator']: getters.userId,
    [withPostfix ? 'updatetime_t' : 'uptimedate']: moment().format('YYYY-MM-DDTHH:mm:ss')
  }
}

export {
  defaultCreateDate,
  defaultUpdateDate,
  defaultCreateTime,
  defaultUpdateTime
}
