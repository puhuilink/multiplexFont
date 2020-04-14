import apollo from '@/utils/apollo'
import moment from 'moment'
import { axios } from '@/utils/request'
import { oldRequest } from '@/utils/oldRequest'
import {
  mutationInsertUsers,
  mutationUpdateUser
} from '../graphql/User'
import { fetchLastesdViewId } from './View'
const CryptoJS = require('crypto-js')

export const login = function ({ userId, pwd }) {
  // 从环境读入而非硬编码到 JS 文件里
  const key = CryptoJS.enc.Latin1.parse(process.env.VUE_APP_ENCRYPT_KEY)
  const iv = CryptoJS.enc.Latin1.parse(process.env.VUE_APP_ENCRYPT_IV)

  // 加密密码
  const encryptedPwd = CryptoJS.AES.encrypt(pwd, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC
    // padding: CryptoJS.pad.ZeroPadding
  }).toString()

  // 请求
  return axios.post('/user/login', {
    userId,
    encryptedPwd
  })
}

/**
 * 旧系统登录接口
 * @param {*} data
 */
export const loginOld = function () {
  console.dir(oldRequest)
  return oldRequest.post('/rest/DoLogin/DoLogin', ['administrator', 'zhongjiao@123'])
}

/**
 * （批量）新增用户
 * @param {Array<Object>} objects
 * @param {Array<Object>} views
 * @return {Promise}
 */
const addUsers = function (objects = [], views = []) {
  return apollo.clients.alert.mutate({
    mutation: mutationInsertUsers,
    variables: {
      objects: objects.map(obj => ({
        ...obj,
        // FIXME: 初始值都是DB，还是为空后期配？
        auth_method: 'DB',
        // TODO: 放到 hasura webhook 处理？
        createdate: moment().format('YYYY-MM-DDTHH:mm:ss')
      })),
      views
    }
  })
  // .catch(err => {
  // // TODO: notification
  //   if (/GraphQL error: Uniqueness violation. duplicate key value/.test(err.message)) {
  //     throw new Error('用户名已存在')
  //   }
  // })
}

/**
 * 新增单个用户
 * @param {Objet} object
 * @return {Promise}
 */
export const addUser = async function (user) {
  // TODO: 数据表已调整为 id 自增
  const viewId = await fetchLastesdViewId()
  const view = {
    view_id: viewId + 1,
    view_name: user.user_id,
    view_title: '自定义',
    view_type: 'view',
    creator: user.user_id,
    content: '',
    protect_level: '0'
  }
  return addUsers([user], [view])
}

export const updateUser = function (object = {}) {
  //  TODO: 字段校验？统一拦截器？
  if (!object.user_id) {
    throw new Error('user_id缺失')
  }
  return apollo.clients.alert.mutate({
    mutation: mutationUpdateUser,
    variables: {
      where: {
        'user_id': {
          '_eq': object.user_id
        }
      },
      user: {
        ...object,
        // FIXME: 初始值都是DB，还是为空后期配？
        auth_method: 'DB',
        // TODO: 放到 hasura webhook 处理？
        updatedate: moment().format('YYYY-MM-DDTHH:mm:ss')
      }
    }
  }).catch(err => {
    if (/GraphQL error: Uniqueness violation. duplicate key value/.test(err.message)) {
      throw new Error('用户名已存在')
    }
  })
}
