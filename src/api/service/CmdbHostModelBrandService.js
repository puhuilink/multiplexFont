import { BaseService } from './BaseService'
import { CmdbHostModelBrandDao } from '../dao'
import { query } from '../utils/hasura-orm/index'
import _ from 'lodash'

class CmdbHostModelBrandService extends BaseService {
  static async find ({ where = {} }) {
    if (_.isEmpty(where)) return []

    const { data: { list } } = await query(
      CmdbHostModelBrandDao.find({
        where,
        alias: 'list',
        fields: [
          // 监控类型
          'type_model_value_code',
          'device_model_value_code',
          // 品牌
          'brand_value_code',
          'brand_name',
          // 设备
          'host_id',
          'host_alias'
        ]
      })
    )

    return list
  }
}

export {
  CmdbHostModelBrandService
}
