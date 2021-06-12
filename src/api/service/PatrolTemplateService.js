import { BaseService } from '@/api/service/BaseService'
import { PatrolTemplateDao } from '../dao/index'
import { query } from '../utils/hasura-orm/index'
import { xungeng } from '@/utils/request'

class PatrolTemplateService extends BaseService {
  static async find (args = {}) {
    const q = await query(
      PatrolTemplateDao.find(args)
    )
    return q
  }

  static async insert (form) {
    const q = await xungeng.post('/template/add', form)
    return q
  }

  static async batchDelete (ids) {
    const format = { ids: ids }
    const q = await xungeng.post('/template/batchDelete', format)
    return q
  }

  static async update (form) {
    const q = await xungeng.post('/template/update', form)
    return q
  }
}

export { PatrolTemplateService }
