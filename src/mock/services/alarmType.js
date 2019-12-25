import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 2

// 告警类型模拟数据
const alarmTypeList = (options) => {
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
      'turnoverTime|1': '@datetime',
      'name|1-1': [
        '北京告警', '厦门告警'
      ],
      'showName|1-1': [
        '北京告警', '厦门告警'
      ],
      'showIcon|1': [
        'AlertType'
      ],
      'DPFiled|1': [
        'bjDomain'
      ],
      'alarmCode|1': [
        ''
      ],
      'mid|1': [
        'CommonCi'
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

// 获取模拟接口
Mock.mock(/\/alarmType\/list/, 'get', alarmTypeList)
