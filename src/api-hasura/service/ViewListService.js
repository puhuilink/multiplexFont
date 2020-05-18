import { BaseService } from './BaseService'
import {
  ViewListDao
} from '../dao/index'
import { mutate } from '../utils/hasura-orm/index'

class ViewListService extends BaseService {
  /**
   * 新增视图表土
   */
  static async add (argus = {}) {
    await mutate(
      ViewListDao.add(argus)
    )
  }

  /**
   * 编辑视图标题
   */
  static async update (view = {}, where = {}) {
    await mutate(
      ViewListDao.update(view, where)
    )
  }
}

export {
  ViewListService
}
