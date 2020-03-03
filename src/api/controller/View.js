import apollo from '@/utils/apollo'
import moment from 'moment'
import store from '@/store'
import {
  mutationInsertViews,
  mutationUpdateView,
  queryViewList
} from '../graphql/View'

// TODO: default value
export const getViewList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryViewList,
    variables
  })
}

/**
 * 编辑视图（标题）
 * @param viewId
 * @param set
 * @return {*}
 */
export const updateView = function (viewId, set = {}) {
  // TODO: 字段校验 与 error catch + notification
  if (!viewId) {
    throw new Error('view_id 缺失')
  }
  return apollo.clients.alert.mutate({
    mutation: mutationUpdateView,
    variables: {
      viewId,
      set
    }
  })
}

/**
 * 新建视图（标题）
 * @param {Object} object
 * @return {*}
 */
export const addView = function (object = {}) {
  const objects = [
    {
      ...object,
      // FIXME: 此处默认一致？
      'view_name': object.view_name || object.view_title,
      // TODO: default type
      'view_type': 'h5',
      // TODO: default level
      'protect_level': '1',
      // FIXME: name 还是 id ？
      creator: store.state.user.name,
      // TODO: 放到 hasura webhook 处理？
      createdate: moment().format('YYYY-MM-DDTHH:mm:ss')
    }
  ]
  // return console.log(objects)
  return apollo.clients.alert.mutate({
    mutation: mutationInsertViews,
    variables: {
      objects
    }
  })
}

/**
 * 批量新建视图（标题）
 * @param {Array<Object>>} objects
 * @return {*}
 */
export const addViews = function (objects = {}) {
  if (objects.length === 0) {
    throw new Error('参数为空')
  }
  return apollo.clients.alert.mutate({
    mutation: mutationInsertViews,
    variables: {
      objects
    }
  })
}
