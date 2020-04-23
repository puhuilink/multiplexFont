import { BaseService } from './BaseService'
import { ModelDao } from '../dao/ModelDao'
import { mutate } from '../utils/hasura-orm'

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
}

export {
  ModelService
}
