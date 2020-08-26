import { BaseService } from './BaseService'
import { AuthorizeObjectDao, ViewListDao } from '../dao/index'
import { mutate, query } from '../utils/hasura-orm/index'
import { OBJECT_TYPE } from '../dao/types/AuthorizeObject'
import { axios } from '@/utils/request'

class ViewListService extends BaseService {
  /**
   * 新增视图(标题)
   */
  static async add (argus = {}) {
    await mutate(
      ViewListDao.add(argus)
    )
  }

  /**
   * 编辑视图(标题)
   */
  static async update (view = {}, where = {}) {
    await mutate(
      ViewListDao.update(view, where)
    )
  }

  static async find (argus = {}) {
    return query(
      ViewListDao.find(argus)
    )
  }

  static async batchDelete (idList = []) {
    await mutate(
      ViewListDao.batchDelete({ view_id: { _in: idList } }),
      AuthorizeObjectDao.batchDelete({ object_id: { _in: idList.map(id => `${id}`) }, object_type: { _eq: OBJECT_TYPE.view } })
    )
  }

  static async copy (viewId) {
    return axios.get(`/view/copy?viewId=${viewId}`)
  }
}

export {
  ViewListService
}
