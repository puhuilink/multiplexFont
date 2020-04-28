import { BaseService } from './BaseService'
import { ModelDao } from '../dao/index'
import { mutate, query } from '../utils/hasura-orm'

class ModelService extends BaseService {
  /**
   * 新增模型节点
   * @param {Objetc} model
   * @return {Promise<any>}
   */
  static async add (model = {}) {
    try {
      await mutate(
        ModelDao.add(model)
      )
      // await ModelDao.add(model).mutate()
    } catch (e) {
      throw e
    }
  }

  /**
   * 更新模型节点
   * @param {Objetc} model
   * @return {Promise<any>}
   */
  static async update (model, where) {
    await mutate(
      ModelDao.update(model, where)
    )
  }

  // TODO: 拆分
  static async find (argus = {}) {
    const res = await query(
      ModelDao.find(argus)
    )
    return res
  }
}

export {
  ModelService
}
