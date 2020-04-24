import {
  KpiCurrentHistoryDao,
  KpiCurrentLastestDao,
  InstanceDao,
  InstanceValuesDao
} from '../dao/index'
import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'

class KpiCurrentService extends BaseService {
  static async _getKpiAndCiInfo ({ selectedKpi, selectedInstance }) {
    await Promise.all([
      ...selectedKpi.map(kpicode_s => InstanceValuesDao.find({ where: kpicode_s })),
      ...selectedInstance.map(_id_s => InstanceDao.find({ where: _id_s }))
    ])
  }
  /**
   * 获取一条或多条最新指标
   * @param {Array<Object>} argus 要获取指标的配置
   * @return {Promise<any>}
   */
  static async latestValue (argus = []) {
    await query(
      ...argus.map(({ ci_id, kpi_code }) => KpiCurrentLastestDao.findLastestOne({ where: { ci_id, kpi_code }, fields: ['ci_id', 'kpi_code', 'kpi_value_num'] }))
    )
  }

  /**
   * 获取一条或多条历史指标
   * @param {Array<Object>} argus 要获取指标的配置
   * @return {Promise<any>}
   */
  static async historyValue (argus = []) {
    await query(
      ...argus.map(({ ci_id, kpi_code }) => KpiCurrentHistoryDao.find({
        where: { ci_id, kpi_code }
      }))
    )
  }
}

export {
  KpiCurrentService
}
