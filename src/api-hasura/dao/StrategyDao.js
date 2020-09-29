import { imp } from '../config/client'
import { BaseDao } from './BaseDao'
import { override, readonly } from 'core-decorators'
import { createTime, updateTime } from '../utils/mixin/autoComplete'

class StrategyDao extends BaseDao {
  @readonly
  static SCHEMA = 't_strategy'

  @readonly
  static PROVIDER = imp

  @readonly
  static FIELDS_MAPPING = new Map([])

  @override
  static async add (argus) {
    // await this._uniqueValidate(argus)
    return super.add({
      ...argus,
      ...createTime()
    })
  }

  @override
  static async update (set, where) {
    // await this._uniqueValidate(set, false)
    return super.update({
      ...set,
      ...updateTime()
    }, where)
  }
}

export {
  StrategyDao
}
