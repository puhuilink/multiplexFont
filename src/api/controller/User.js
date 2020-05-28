import apollo from '@/utils/apollo'
import moment from 'moment'
import { axios } from '@/utils/request'
import {
  mutationInsertUsers,
  mutationUpdateUser
} from '../graphql/User'
import { fetchLastestViewId } from './View'
import { encrypt } from '@/utils/aes'

export const login = function ({ userId, pwd }) {
  // 加密密码
  const encryptedPwd = encrypt(pwd)
  const user = encrypt(userId)

  // 请求
  return axios.post('/user/login', {
    userId: user,
    encryptedPwd
  })
}

export const resetPwd = function ({ userId, encryptedPwd, newEncryptedPwd }) {
  const data = {
    userId: encrypt(userId),
    encryptedPwd: encrypt(encryptedPwd),
    newEncryptedPwd: encrypt(newEncryptedPwd)
  }
  return axios.post('/user/changePassword', data)
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
  const viewId = await fetchLastestViewId()
  const view = {
    view_id: viewId + 1,
    view_name: user.user_id,
    view_title: '自定义',
    view_type: 'desktop',
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
