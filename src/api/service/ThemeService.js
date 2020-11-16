import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import { ThemeDao } from '../dao/index'
import _ from 'lodash'

class ThemeService extends BaseService {
  static async find (argus = {}) {
    return query(
      ThemeDao.find(argus)
    )
  }

  static async fetchTheme () {
    const { data: { themeList } } = await query(
      ThemeDao.find({
        where: { is_activated: 1 },
        fields: ['settings', 'bg_image'],
        alias: 'themeList'
      })
    )
    return _.first(themeList)
  }
}

export {
  ThemeService
}
