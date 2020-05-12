import { BaseService } from './BaseService'
import { RelationAttributeDao } from '../dao/index'
import { query, mutate } from '../utils/hasura-orm/index'

class RelationAttributeService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      RelationAttributeDao.find(argus)
    )
    return res
  }

  static async add (argus = {}) {
    await mutate(
      RelationAttributeDao.add(argus)
    )
  }

  static async update (set = {}, where = {}) {
    await mutate(
      RelationAttributeDao.update(set, where)
    )
  }

  static async batchDelete (idList = []) {
    await mutate(
      // 关系属性删除
      RelationAttributeDao.batchDelete({ _id: { _in: idList } })
      // TODO: 实例的关系属性更新？
    )
  }
}

export {
  RelationAttributeService
}
