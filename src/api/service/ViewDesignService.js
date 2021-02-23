import _ from 'lodash'
import gql from 'graphql-tag'
import moment from 'moment'
import store from '@/store'
import { BaseService } from './BaseService'
import { ViewDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'
import { CacheMutationTypes } from '@/store/modules/cache'
import { VIEW_TYPE } from '@/tables/view/enum'
import { SOURCE_TYPE_COMBO, SOURCE_TYPE_REAL } from '@/model/config/dataConfig/dynamicData/types/sourceType'

const injectTemplateView = (view, host_id) => {
  if (view.view_type !== VIEW_TYPE.template || !host_id) {
    return view
  }

  const { widgets = [] } = view.content

  // 替换为当前具体host的id
  widgets.forEach(({ config }) => {
    const sourceType = _.get(config, ['dataConfig', 'sourceType'])
    const resourceConfig = _.get(config, ['dataConfig', 'dbDataConfig', 'resourceConfig'])
    if (resourceConfig && sourceType === SOURCE_TYPE_REAL) {
      resourceConfig.hostId = [host_id]
    }
    const comboConfig = _.get(config, ['dataConfig', 'dbDataConfig', 'comboConfig'])
    if (comboConfig && sourceType === SOURCE_TYPE_COMBO) {
      comboConfig.content.forEach(c => {
        Object.assign(c, { hostId: host_id })
      })
    }
  })

  return view
}

class ViewDesignService extends BaseService {
  static async _getOriginalDesign (view_id, useCache = true) {
    try {
      let view
      let isDeleted = false
      const fields = ['view_id', 'content', 'view_title', 'view_type', 'updatedate']
      const { views = {} } = store.state['cache']
      const cacheView = views[view_id]

      if (useCache && cacheView) {
        // 以updatedate为标识判断缓存是否是最新值
        const { data } = await query(
          ViewDao.find({
            where: {
              view_id,
              updatedate: {
                _neq: cacheView['updatedate']
              }
            },
            fields,
            alias: 'changedViewList'
          }),
          ViewDao.find({
            where: { view_id },
            fields: ['view_id'],
            alias: 'availableList'
          })
        )

        const { changedViewList: [latestView], availableList } = data
        isDeleted = availableList.length === 0
        if (!isDeleted) {
          view = latestView || cacheView
        }
      } else {
        // 无缓存下直接查询最新数据
        const { data: { viewList } } = await query(
          ViewDao.find({
            where: { view_id },
            fields,
            alias: 'viewList'
          })
        )

        if (viewList.length) {
          view = viewList[0]
        } else {
          isDeleted = true
        }
      }

      if (view) {
        let { content } = view
        const { view_title, view_id } = view
        // 若数据来源于缓存，content已被格式化
        // 若数据来源于远程，content需要被格式化
        if (Object.prototype.toString.call(content) === '[object String]') {
          content = JSON.parse(content)

          if (!_.get(content, ['id'])) {
            throw new Error(`${view_id}为老系统视图`)
          }

          Object.assign(view, {
            content: {
              ...content,
              view_title
            }
          })
        }
      }

      store.commit(CacheMutationTypes.setViews, {
        views: isDeleted ? _.omit(views, [view_id]) : Object.assign(views, { [view_id]: view })
      })

      return Promise.resolve(_.cloneDeep(view))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
   * 获取视图设计详情
   * @param {Number} view_id 视图id
   * @param {String} host_id 当视图类型为模板时，需要指定当前具体host的id
   */
  static async getDesign ({ view_id, host_id, useCache = true }) {
    const view = await this._getOriginalDesign(view_id, useCache)
    const { content } = injectTemplateView(view, host_id)
    return content
  }

  /**
   * 更新视图配置
   * @return {Promise<any>}
   */
  static async updateViewDesign (viewId, content) {
    return ViewDao
      .getProvider()
      .mutate({
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
