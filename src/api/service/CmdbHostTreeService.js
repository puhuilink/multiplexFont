/*
 * @Author: your name
 * @Date: 2021-03-23 18:17:59
 * @LastEditTime: 2021-03-24 12:12:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\src\api\service\CmdbHostTreeService.js
 */
import { BaseService } from '@/api/service/BaseService'
import {
  CmdbHostTreeDao
} from '../dao/index'
import { query } from '@/api/utils/hasura-orm'
class CmdbHostTreeService extends BaseService {
  static async hostIdsQuery (systemId) {
    const { data: { hostIds } } = await query(
      CmdbHostTreeDao.find({
        where: {
          id: {
            _eq: systemId
          }
        },
        fields: [
          'hostIds: host_ids'
        ],
        alias: 'hostIds'
      })
    )
    return hostIds[0].hostIds
  }
}

export {
  CmdbHostTreeService
}
