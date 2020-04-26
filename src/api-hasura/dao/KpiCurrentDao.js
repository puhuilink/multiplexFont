import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { override, readonly } from 'core-decorators'

class KpiCurrentDao extends BaseDao {
  @readonly
  static SCHEMA = 't_kpi_current'
  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([
    ['kpi_code', 'kpi_code'],
    ['ci_id', 'ci_id'],
    ['kpi_value_num', 'kpi_value_num']
  ])

  @override
  static async find ({ where = {}, orderBy = {}, fields = [], limit = 0, offset = 0 }) {
    await super.find({ where })
  }

  static async findLastestOne (argus = {}) {
    await this.findOne({ ...argus, orderBy: { arising_time: 'desc_nulls_last' } })
  }
}

export {
  KpiCurrentDao
}
