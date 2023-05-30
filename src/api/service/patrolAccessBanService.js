import { BaseService } from '@/api/service/BaseService'
import { generateMutation, mutate, query } from '@/api/utils/hasura-orm'
import { PatrolAccessBanDao } from '../dao/PatrolAccessBanDao'
import { AlarmTempDao, UserDao } from '@/api/dao'

export class PatrolAccessBanService extends BaseService {
  static async find (argus = {}) {
    return query(
      PatrolAccessBanDao.find(argus)
    )
  }

  static async add (user = {}) {
    return mutate(PatrolAccessBanDao.add(user))
  }

  static async update (set, where) {
    return mutate(PatrolAccessBanDao.update(set, where))
  }

  static async batchDelete (idList) {
    return mutate(
      PatrolAccessBanDao.batchDelete({ id: { _in: idList } })
    )
  }
}
