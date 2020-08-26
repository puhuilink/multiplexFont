import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
import { ThemeDao } from '../dao'
import _ from 'lodash'

class ThemeService extends BaseService {
  static async find (argus = {}) {
    return query(
      ThemeDao.find(argus)
    )
  }

  static async fetchTheme (argus = {}) {
    const { data: { themeList } } = await query(
      ThemeDao.find({
        // TODO: 增加规则指定生效条目
        where: { id: 1 },
        limit: 1,
        fields: ['settings', 'bg_image'],
        ...argus,
        alias: 'themeList'
      })
    )
    return _.first(themeList)
  }
}

export {
  ThemeService
}
