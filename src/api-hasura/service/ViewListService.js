import { BaseService } from './BaseService'
import {
  ViewListDao
} from '../dao/index'
import { mutate, query } from '../utils/hasura-orm/index'

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
}

export {
  ViewListService
}
