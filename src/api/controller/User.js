import apollo from '@/utils/apollo'
import moment from 'moment'

import {
  mutationInsertUsers,
  mutationUpdateUser
} from '../graphql/User'

/**
 * （批量）新增用户
 * @param {Array<Object>} objects
 * @return {Promise}
 */
export const addUsers = function (objects = []) {
  return apollo.clients.alert.mutate({
    mutation: mutationInsertUsers,
    variables: {
      objects: objects.map(obj => ({
        ...obj,
        // FIXME: 初始值都是DB，还是为空后期配？
        auth_method: 'DB',
        // TODO: 放到 hasura webhook 处理？
        createdate: moment().format('YYYY-MM-DDTHH:mm:ss')
      }))
    }
  }).catch(err => {
    if (/GraphQL error: Uniqueness violation. duplicate key value/.test(err.message)) {
      throw new Error('用户名已存在')
    }
  })
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
