import { BaseService } from './BaseService'
import { ViewDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'
import { imp } from '../config/client'
import gql from 'graphql-tag'
import moment from 'moment'
import store from '@/store'
import { VIEW_TYPE } from '@/tables/view/enum'
import _ from 'lodash'
class ViewDesignService extends BaseService {
  /**
   * 获取视图设计详情
   * @param {Number} view_id 视图id
   * @param {String} host_id 当视图类型为模板时，需要指定当前具体host的id
   */
  static async getDesign (view_id, host_id) {
    return query(
      ViewDao.find({
        where: { view_id },
        fields: ['content', 'view_title', 'view_type'],
        alias: 'viewList'
      })
    )
      .then(({ data: { viewList: [view] } }) => view)
      .then(({ content, ...rest }) => ({
        content: JSON.parse(content),
        ...rest
      }))
      .then(({ content, view_title, view_type }) => {
        if (content && content.id) {
          Object.assign(content, { view_title })
          if (view_type === VIEW_TYPE.template && host_id) {
            // 替换为当前具体host的id
            content.widgets.forEach(({ config }) => {
              const resourceConfig = _.get(config, ['dataConfig', 'dbDataConfig', 'resourceConfig'])
              if (resourceConfig) {
                resourceConfig.hostId = [host_id]
              }
            })
          }
          return content
        }
        throw new Error('老系统视图，将返回空画布')
      })
      .catch(err => Promise.reject(err))
  }

  /**
   * 更新视图配置
   * @return {Promise<any>}
   */
  static async updateViewDesign (viewId, content) {
    return imp.mutate({
      mutation: gql`mutation ($viewId: numeric!, $set: t_view_set_input! = {}) {
        update_t_view (
          where: {
            view_id: {
              _eq: $viewId
            }
          }
          _set:$set
        ) {
          affected_rows
        }
      }`,
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
}

export {
  ViewDesignService
}
