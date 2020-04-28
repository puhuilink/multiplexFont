import { BaseService } from './BaseService'
import { ModelDao } from '../dao/index'
import { mutate } from '../utils/hasura-orm'
import gql from 'graphql-tag'
import { resource } from '../config/client'

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
  static async tree (instanceList = false) {
    const { data: { dataSource } } = await resource.query({
      query: gql`query ($instanceList: Boolean!) {
        dataSource: ngecc_model {
          did
          label_s
          name_s
          batch_b
          edit_b
          encrypt_s
          order_i
          icon_s
          parenttree_s
          _id_s
          title: label_s
          key: name_s
          parentKey: parentname_s
          parentname_s: parentname_s
          instanceList @include(if: $instanceList) {
            did
            _id_s
            name_s
            title: label_s
            key: name_s
            parentKey: parentname_s
            parentname_s: parentname_s
          }
        }
      }`,
      variables: {
        instanceList
      }
    })
    return dataSource
  }
}

export {
  ModelService
}
