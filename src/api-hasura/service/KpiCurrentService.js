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

    // 生成 ci 与 kpi 的基本信息的查询语句
    const infoQueryList = await Promise.all([
      ...selectedKpi.map(kpicode_s => InstanceValuesDao.find({ where: { kpicode_s }, fields: ['kpicode_s', 'label_s'] })),
      ...selectedInstance.map(_id_s => InstanceDao.find({ where: { _id_s }, fields: ['_id_s', 'label_s'] }))
    ])

    // 查询基本信息与指标值
    await query(
      ...infoQueryList,
      ...composedValue.map(({ ci_id, kpi_code }) => KpiCurrentLastestDao.findLastestOne({ where: { ci_id, kpi_code }, fields: ['ci_id', 'kpi_code', 'kpi_value_num'] }))
    )

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
