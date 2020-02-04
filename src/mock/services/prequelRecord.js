import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 5701

// 告警监控模拟数据
const forwardRecordList = (options) => {
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
      'faultLevel|1': [
        '0', '1', '2', '3',
        '4'
      ],
      'faultType|1': [
        '0', '1', '2', '3',
        '4'
      ],
      'shiftType|1': [
        '0', '1', '2'
      ],
      'forwardType|1': [
        '0', '1', '2'
      ],
      'sender|1': [
        '小张', '小董', '小刘'
      ],
      'faultName|1': [
        '采购15', '采购12', '西南区域', '科技评审',
        '生产经营', '核心拓展接入A', '核心拓展接入B',
        '汇聚交换机1', '汇聚交换机2', '汇聚交换机3'
      ],
      'forwardTarget|1': [
        '一级', '二级'
      ],
      'message|1': [
        'APP服务响应时间超时: APP BAD RESPONSE TIME(/PMS/upload)',
        'APP服务响应时间超时: APP BAD RESPONSE TIME(/PMS/jsp/business/bas/file/fileinfo/insertFileForSup.jsp)',
        'APP服务响应时间超时: APP BAD RESPONSE TIME(/PMS/FileInfoAction.do)',
        '三级域汇聚交换机B(BJ-SJ-Aggr-SW2, IP:10.1.1.244) Gi2/0/9: 端口状态不等于Up [ Link Down ]'
      ],
      'firstArisingTime|1': '@datetime',
      'arisingTime|1': '@datetime',
      'severity|1-100': 100
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

// 获取前转记录列表模拟接口
Mock.mock(/\/forwardRecord\/list/, 'get', forwardRecordList)
