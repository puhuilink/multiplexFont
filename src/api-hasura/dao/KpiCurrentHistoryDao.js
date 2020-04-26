import { KpiCurrentDao } from './KpiCurrentDao'
import { alert } from '../config/client'

class KpiCurrentHistoryDao extends KpiCurrentDao {
  static PROVIDER = alert
}

export {
  KpiCurrentHistoryDao
}
