import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { override, readonly } from 'core-decorators'

class AuditDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_user'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

  @override
  static async find ({ where = {}, orderBy = { operation_time: 'desc' }, fields = [], limit = 0, offset = 0, alias = '' }) {
    await super.find({ where, orderBy, fields, limit, offset, alias })
  }
}

export {
  AuditDao
}
