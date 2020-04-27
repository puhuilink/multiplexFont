import { BaseService } from './BaseService'
import {
  InstanceDao
  // InstanceValuesDao
} from '../dao/index'
import { query } from '../utils/hasura-orm/index'
// import _ from 'lodashj'

class ViewDesignService extends BaseService {
  static async nodeByCi (name_s) {
    const { data: { nodes: [node] } } = await query(
      InstanceDao.find({
        where: { name_s },
        alias: 'nodes',
        // 关联表：InstanceValuesDao
        fields: [
          'label_s',
          'name_s',
          '_id_s',
          'parentname_s',
          `values: instanceValues {
            icon_s
          }`
        ]
      })
    )
    return node
  }
}

export {
  ViewDesignService
}
