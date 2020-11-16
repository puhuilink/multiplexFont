import store from '@/store'
import moment from 'moment'

/**
 * 默认创建人与时间戳
 * @param {Boolean} withPostfix 字段是否带下标
 * @return {Object}
 */
const defaultCreateDate = function (withPostfix = false) {
  return {
    [withPostfix ? 'creator_s' : 'creator']: store.getters.userId,
    [withPostfix ? 'createdate_t' : 'createdate']: moment().format('YYYY-MM-DDTHH:mm:ss')
  }
}

/**
 * 默认更新人与时间戳
 * @param {Boolean} withPostfix 字段是否带下标
 * @return {Object}
 */
const defaultUpdateDate = function (withPostfix = false) {
  return {
    [withPostfix ? 'updator_s' : 'updator']: store.getters.userId,
    [withPostfix ? 'updatedate_t' : 'updatedate']: moment().format('YYYY-MM-DDTHH:mm:ss')
  }
}

const createTime = () => ({ 'create_time': moment().format('YYYY-MM-DD HH:mm:ss') })
const updateTime = () => ({ 'update_time': moment().format('YYYY-MM-DD HH:mm:ss') })

export {
  defaultCreateDate,
  defaultUpdateDate,
  createTime,
  updateTime
}
