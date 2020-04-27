import { cache } from '../config/client'
import { KpiCurrentDao } from './KpiCurrentDao'

class KpiCurrentLastestDao extends KpiCurrentDao {
  static PROVIDER = cache
}

export {
  KpiCurrentLastestDao
}
