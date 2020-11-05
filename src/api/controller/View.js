import apollo from '@/utils/apollo'
import moment from 'moment'
import store from '@/store'
import {
  mutationUpdateView
} from '../graphql/View'
import { axios } from '@/utils/request'

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
 * 更新视图配置
 * @return {Promise<any>}
 */
export const updateViewDesign = async function (viewId, content) {
  return apollo.clients.imp.mutate({
    mutation: mutationUpdateView,
    variables: {
      viewId: Number(viewId),
      set: {
        content: content ? JSON.stringify(content) : '',
        updator: store.state.user.info.userId,
        updatedate: moment().format('YYYY-MM-DDTHH:mm:ss')
      }
    }
  })
}
