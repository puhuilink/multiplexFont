// 数据分析模块接口数据

import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

// 模拟数据
const strategyList = (options) => {
  const totalCount = 1
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
      'policyName|1': '深信服AD设备_系统并发连接数',
      'cycle': '30',
      'timeStep': '10',
      'sampleRegion': '0.9',
      'computingTime': '0 10 11 * * ?'
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

const definitionList = (options) => {
  const totalCount = 2
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
      'policyName|1': ['深信服AD设备_系统并发连接数', 'L1-应用系统运行总图.当前实时连接数动态基线'],
      'cycle|1': ['按周计算', '按日计算'],
      'nodeType': '	AD负载均衡',
      'nodeInstance|1': ['互联网链路负载', '公网链路负载均衡A'],
      'kpi': '系统当前连接数'
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

Mock.mock(/\/policy\/list/, 'get', strategyList)
Mock.mock(/\/definition\/list/, 'get', definitionList)
