import { BaseService } from './BaseService'
import { ModelDao } from '../dao/ModelDao'

class ModelService extends BaseService {
  /**
   * 新增模型节点
   * @param {Objetc} model
   * @return {Promise<any>}
   */
  static async add (model = {}) {
    try {
      await this.uniqueValidate(model, ModelDao)
      await ModelDao.add(model).mutate()
    } catch (e) {
      throw e
    }
  }

  /**
   * 更新模型节点
   * @param {Objetc} model
   * @return {Promise<any>}
   */
  static async update (model = {}) {
    try {
      await this.uniqueValidate(model, ModelDao, false)
      await ModelDao.update(model).mutate()
    } catch (e) {
      throw e
    }
  }
}

export {
  ModelService
}
