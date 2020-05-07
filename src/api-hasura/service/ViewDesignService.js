import { BaseService } from './BaseService'
import {
  InstanceDao
  // InstanceValuesDao
} from '../dao/index'
import { query } from '../utils/hasura-orm/index'
// import _ from 'lodashj'

class ViewDesignService extends BaseService {
  static async nodeByCiName (name) {
    const { data: { nodes: [node] } } = await query(
      InstanceDao.find({
        where: { name },
        alias: 'nodes',
        fields: [
          'label',
          'name',
          '_id',
          'parentName',
          `icon: values(path: "$.icon")`
        ]
      })
    )
    return node
  }
}

export {
  ViewDesignService
}
