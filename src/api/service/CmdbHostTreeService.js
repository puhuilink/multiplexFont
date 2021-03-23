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
          'host_ids'
        ],
        alias: 'hostIds'
      })
    )

    return hostIds
  }
}

export {
  CmdbHostTreeService
}
