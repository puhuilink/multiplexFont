import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { CmdbHostViewDao } from '../dao'
import _ from 'lodash'

class CmdbHostViewService extends BaseService {
  static async viewIdByHost ({ t_model_host_type = '', t_cmdb_host_id = 0 }) {
    const queryList = [
      // 实例绑定的视图
      ...t_cmdb_host_id ? [
        CmdbHostViewDao.find({
          where: { t_cmdb_host_id },
          fields: ['t_view_id'],
          alias: 'listByHostId'
        })
      ] : [],
      // 模型绑定的视图
      ...t_model_host_type ? [
        CmdbHostViewDao.find({
          where: { t_model_host_type },
          fields: ['t_view_id'],
          alias: 'listByHostType'
        })
      ] : []
    ]

    if (_.isEmpty(queryList)) return

    const { data } = await query(...queryList)

    // 实例未绑定视图则继承模型绑定的视图
    return _.get(data, 'listByHostId[0].t_view_id') || _.get(data, 'listByHostType[0].t_view_id') || ''
  }
}

export {
  CmdbHostViewService
}
