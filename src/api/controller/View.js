import apollo from '@/utils/apollo'
import moment from 'moment'
import store from '@/store'
import {
  mutationUpdateView,
  queryViewList,
  mutationDeleteViews,
  queryMaxDid
} from '../graphql/View'
import { axios } from '@/utils/request'

export const fetchLastestViewId = function () {
  return apollo.clients.alert.query({
    query: queryMaxDid
  }).then(r => r.data.data.aggregate.max.view_id)
}

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

export const deleteViews = function (viewIdList = []) {
  return apollo.clients.alert.mutate({
    mutation: mutationDeleteViews,
    variables: {
      viewIdList
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

export const copyView = async (viewId) => {
  return axios.get(`/view/copy?viewId=${viewId}`)
}
