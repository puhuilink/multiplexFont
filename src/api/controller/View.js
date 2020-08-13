import apollo from '@/utils/apollo'
import moment from 'moment'
import store from '@/store'
import {
  mutationUpdateView,
  queryViewList
} from '../graphql/View'
import { axios } from '@/utils/request'

export const getViewList = function (variables = {}) {
  const where = variables.where || {}
  return apollo.clients.alert.query({
    query: queryViewList,
    variables: {
      ...variables,
      where: {
        'view_type': {
          _eq: 'h5'
        },
        ...where
      }
    }
  })
}

/**
 * 生成视图缩略图
 * @param {File} file
 * @param {String | Number} id 视图id
 */
export const updateViewThumbnail = function (file, id) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('id', `${id}`)
  return axios.post('/view/edit', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
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
      set: {
        ...set,
        updator: store.state.user.info.userId,
        updatedate: moment().format('YYYY-MM-DDTHH:mm:ss')
      }
    }
  }).then(r => r.data.update_t_view.affected_rows)
    .then(row => {
      if (row === 1) {
        return true
      } else {
        throw new Error('更新视图配置失败')
      }
    })
}

/**
 * 更新视图配置
 * @return {Promise<any>}
 */
export const updateViewDesign = async function (viewId, content) {
  return apollo.clients.alert.mutate({
    mutation: mutationUpdateView,
    variables: {
      viewId: Number(viewId),
      set: {
        content: content ? JSON.stringify(content) : '',
        updator: store.state.user.info.userId,
        updatedate: moment().format('YYYY-MM-DDTHH:mm:ss')
      }
    }
  }).then(r => r.data.update_t_view.affected_rows)
    .then(row => {
      if (row === 1) {
        return true
      } else {
        throw new Error('更新视图配置失败')
      }
    })
}
