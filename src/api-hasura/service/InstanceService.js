import { BaseService } from './BaseService'
import { InstanceDao, RelationInstanceDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'

class InstanceService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      InstanceDao.find(argus)
    )
    return res
  }

  /**
   * 实例详情
   * @param {String} _id 实例 id
   * @return {Promise<any>}
   */
  static async detail (_id) {
    const { data: { instanceList, pointOutInstanceList, pointInInstanceList } } = await query(
      // 实例
      InstanceDao.find({
        where: {
          _id
        },
        fields: [
          '_id',
          'name',
          'label',
          'values'
        ],
        alias: 'instanceList'
      }),
      // 实例的关联实例（指出）
      RelationInstanceDao.find({
        where: {
          instanceId: _id
        },
        fields: [
          '_id'
        ],
        alias: 'pointOutInstanceList'
      }),
      // 被哪些实例关联（指入）
      RelationInstanceDao.find({
        where: {
          targetId: _id
        },
        fields: [
          '_id'
        ],
        alias: 'pointInInstanceList'
      })
    )

    const [instance] = instanceList
    Object.assign(instance, {
      pointInInstanceList,
      pointOutInstanceList
    })
    // console.log(instance)

    return instance
  }
}

export {
  InstanceService
}
