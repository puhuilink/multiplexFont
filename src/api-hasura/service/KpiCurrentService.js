import {
  KpiCurrentHistoryDao,
  KpiCurrentLastestDao,
  InstanceDao
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
    const { data } = await query(
      InstanceDao.find({
        where: {
          _id: {
            _in: selectedInstance
          }
        },
        fields: [
          '_id',
          'label'
        ],
        alias: 'ciList'
      }),
      // TODO: jsonb 不支持批量查询，只能拆分为多个单查询再合并结果
      ...selectedKpi.map((kpiCode, index) => InstanceDao.find({
        where: {
          parentName: {
            _eq: 'Kpi'
          },
          values: {
            _contains: { kpiCode }
          }
        },
        fields: [
          `label: values(path: "$.label")`,
          `kpiCode: values(path: "$.kpiCode")`
        ],
        alias: `kpiCode${index}`
      }))
    )

    const { ciList, ...KpiListMerge } = data
    const kpiList = Object.values(KpiListMerge).flat()
    // console.log(ciList, Object.values(KpiListMerge).flat())

    // 构建 hash map
    return {
      ci: new Map(ciList.map(ci => [`${ci._id}`, ci.label])),
      kpi: new Map(kpiList.map(kpi => [`${kpi.kpiCode}`, kpi.label]))
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
   * @param {Array<String>} timeRange 时间区间
   * @return {Promise<Array<any>>}
   */
  static async getValue ({
    where = {},
    limit = 0,
    offset = 0,
    orderBy = { arising_time: 'desc' },
    fields = [],
    selectedKpi = [],
    selectedInstance = [],
    timeRange = {}
  }) {
    const { _getKpiAndCiInfo, _composeKpiAndCi } = this
    const { timeRangeStart, timeRangeEnd } = timeRange || {}

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

    const [{ ci, kpi }, { data }] = await Promise.all([
      _getKpiAndCiInfo(selectedKpi, selectedInstance),
      query(
        dao.find({
          where: {
            _or: argus.map(({ ci_id, kpi_code }) => ({
              ci_id: { _eq: ci_id },
              kpi_code: { _eq: kpi_code },
              ...where,
              ...timeRangeQuery
            }))
          },
          fields: _.uniq([
            'ci_id',
            'kpi_code',
            'arising_time',
            'value: kpi_value_num',
            ...fields
          ]),
          limit,
          offset,
          alias: 'data',
          orderBy
        })
      )
    ])

    data.data = data.data.map(kpiValue => ({
      ...kpiValue,
      kpiLabel: kpi.get(`${kpiValue.kpi_code}`),
      instanceLabel: ci.get(`${kpiValue.ci_id}`)
    }))

    return data
  }
}

export {
  KpiCurrentService
}
