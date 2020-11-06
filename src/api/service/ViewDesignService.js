import { BaseService } from './BaseService'
import { InstanceDao, ViewDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'
import _ from 'lodash'
import { imp } from '../config/client'
import gql from 'graphql-tag'
import moment from 'moment'
import store from '@/store'
class ViewDesignService extends BaseService {
  static async getDesign (view_id) {
    return query(
      ViewDao.find({
        where: { view_id },
        fields: ['content'],
        alias: 'viewList'
      })
    )
      .then(({ data: { viewList: [view] } }) => _.get(view, 'content'))
      .then(content => JSON.parse(content))
      .then(design => {
        if (design && design.id) {
          return design
        } else {
          throw new Error('老系统视图，将返回空画布')
        }
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

  static async nodeByCiName (name) {
    const { data: { nodes: [node] } } = await query(
      InstanceDao.find({
        where: { name },
        alias: 'nodes',
        fields: [
          'label',
          'name',
          '_id',
          'parentName',
          `icon: values(path: "$.icon")`
        ]
      })
    )
    return node
  }
}

export {
  ViewDesignService
}
