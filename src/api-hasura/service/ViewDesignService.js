import { BaseService } from './BaseService'
import { InstanceDao, ViewDao } from '../dao/index'
import { mutate, query } from '../utils/hasura-orm/index'
import _ from 'lodash'

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

  // FIXME: json 格式化异常
  static async updateDesign (set, where) {
    return mutate(
      ViewDao.updateDesign(set, where)
    )
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
