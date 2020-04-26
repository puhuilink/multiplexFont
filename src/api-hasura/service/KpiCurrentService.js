import {
  KpiCurrentHistoryDao,
  KpiCurrentLastestDao,
  InstanceDao,
  InstanceValuesDao
} from '../dao/index'
import { BaseService } from './BaseService'
import { query } from '../utils/hasura-orm/index'
import _ from 'lodash'

class KpiCurrentService extends BaseService {
  /**
   * 获取选中的 ci 与 kpi 的基本信息
   * @param {Array<String>} selectedKpi 选中的 kpi
   * @param {Array<String>} selectedInstance 选中的 ci
   * @return {Promise<Object>}
   */
  static async _getKpiAndCiInfo (selectedKpi = [], selectedInstance = []) {
    // 查询基本信息与指标值
    const { data: { ciList, kpiList } } = await query(
      InstanceDao.find({ where: { _id_s: { _in: selectedInstance } }, fields: ['_id_s', 'label_s'], alias: 'ciList' }),
      InstanceValuesDao.find({ where: { kpicode_s: { _in: selectedKpi } }, fields: ['kpicode_s', 'label_s'], alias: 'kpiList' })
    )

    // 构建 hash map
    return {
      ci: new Map(ciList.map(ci => [`${ci._id_s}`, ci.label_s])),
      kpi: new Map(kpiList.map(kpi => [`${kpi.kpicode_s}`, kpi.label_s]))
    }

    // 组合返回体
  }

  static _composeKpiAndCi (selectedKpi = [], selectedInstance = []) {
    const composedValue = []
    selectedInstance.forEach(ci_id => {
      selectedKpi.forEach(kpi_code => {
        composedValue.push({ kpi_code, ci_id })
      })
    })
    return composedValue
  }

  /**
   * 查询最新值
   * @param {Array<String>} selectedKpi 选中的 kpi
   * @param {Array<String>} selectedInstance 选中的 ci
   * @param {Array<Moment>} timeRange 时间区间
   * @return {Promise<Array<any>>}
   */
  static async getValue ({ selectedKpi = [], selectedInstance = [] }, { timeRangeStart, timeRangeEnd }) {
    const { _getKpiAndCiInfo, _composeKpiAndCi } = this

    const argus = _composeKpiAndCi(selectedKpi, selectedInstance)

    // 起始时间与结束时间不相同时，认为是按时间范围查找
    const timeRangeQuery = (timeRangeStart && timeRangeStart !== timeRangeEnd) ? {
      arising_time: {
        _gte: `"${timeRangeStart}"`,
        _lte: `"${timeRangeEnd}"`
      }
    } : {}

    // 存在时间范围从历史值中查找，反之从最新值查找
    const dao = _.isEmpty(timeRangeQuery) ? KpiCurrentLastestDao : KpiCurrentHistoryDao

    const [{ ci, kpi }, { data: { kpiValueList } }] = await Promise.all([
      _getKpiAndCiInfo(selectedKpi, selectedInstance),
      query(
        dao.find({
          where: {
            _or: argus.map(({ ci_id, kpi_code }) => ({
              ci_id: { _eq: ci_id },
              kpi_code: { _eq: kpi_code },
              ...timeRangeQuery
            }))
          },
          fields: [
            'ci_id',
            'kpi_code',
            'arising_time',
            'kpi_value_num',
            'kpi_value_txt'
          ],
          alias: 'kpiValueList'
        })
      )
    ])

    // 拼接返回结果
    return kpiValueList.map(kpiValue => ({
      ...kpiValue,
      kpiLabel: kpi.get(`${kpiValue.kpi_code}`),
      instanceLabel: ci.get(`${kpiValue.ci_id}`)
    }))
  }
}

export {
  KpiCurrentService
}
