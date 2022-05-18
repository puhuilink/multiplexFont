import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import {
  CorpMapValueDao
} from '../dao/index'
import { crop } from '@/utils/request'

class CorpMapValueService extends BaseService {
  static find (argus = {}) {
    return query(CorpMapValueDao.find(argus))
  }

  static relationFill () {
    return crop.post('/listKey')
  }
}

export { CorpMapValueService }
