import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 5701

// 指标列表模拟数据
const quotaList = (options) => {
  const parameters = getQueryParameters(options)
  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push(Mock.mock({
      key: tmpKey,
      id: tmpKey,
      no: 'No ' + tmpKey,
      editable: false,
      'refreshTime|1': '@datetime',
      'name|1': [
        'TotalIT_P_Alert_AppSysL3_30days',
        'TotalIT_P_Alert_CriticalOpenOccuredInLast1h',
        'Alert_count_relationship_latest30_day_L1',
        'Alert_count_relationship_latest30_day_L2',
        'Alert_count_relationship_latest30_day_L3',
        'Alert_count_relationship_latest30_day_L4',
        'Alert_count_relationship_latest30_day_L5',
        'Alert_count_relationship_latest30_day_all',
        'All_state_Alert_count_relationship_latest30_day_L1',
        'All_state_Alert_count_relationship_latest30_day_L2'
      ],
      'showName|1': [
        'BJ-应用最近30日告警数量-Minor',
        '前1小时发生_未关闭Critical告警',
        '最近30天未关闭告警统计_级别L1',
        '最近30天未关闭告警统计_级别L2',
        '最近30天未关闭告警统计_级别L3',
        '最近30天未关闭告警统计_级别L4',
        '最近30天未关闭告警统计_级别L5',
        '最近30天未关闭告警统计_级别all'
      ],
      'icon': 'KPI',
      'domain': 'rootDomain',
      'KPICode|1': [
        '16019092', '16019007', '111000111', '111000112', '111000113'
      ],
      'model|1': [
        'TotallT', 'KQI-Cal-Layer', 'DCTS', 'ApplicationSystem'
      ]
    }))
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

// 获取视图列表模拟接口
Mock.mock(/\/quota\/list/, 'get', quotaList)
