import {
  KpiCurrentHistoryDao,
  KpiCurrentLastestDao,
  InstanceDao,
  InstanceValuesDao
} from '../dao/index'
import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'

class KpiCurrentService extends BaseService {
  /**
   * 获取选中的 ci 与 kpi 的基本信息
   * @param {{Object}} param0
   * @return {Promise<Array<HasuraORM>>}
   */
  static async _getKpiAndCiInfo ({ selectedKpi = [], selectedInstance = [] }) {
    // 将 ci 与 kpi 一一组合
    const composedValue = []
    selectedInstance.forEach(ci_id => {
      selectedKpi.forEach(kpi_code => {
        composedValue.push({ kpi_code, ci_id })
      })
    })

    // 查询基本信息与指标值
    const { data } = await query(
      InstanceDao.find({ where: { _id_s: { _in: selectedInstance } }, fields: ['_id_s', 'label_s'], alias: 'ci' }),
      InstanceValuesDao.find({ where: { kpicode_s: { _in: selectedKpi } }, fields: ['kpicode_s', 'label_s'], alias: 'kpi' })
    )
    return data

    // 组合返回体
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
