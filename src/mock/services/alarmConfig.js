import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 9

// 告警规则模拟数据
const alarmRuleList = (options) => {
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
      'ruleName|1': [
        '测试_北京数据库告警规则', '告警清出内存', '同告警合并', '厦门动环监控告警合并',
        '厦门IT监控告警合并', '北京IT监控告警合并', '北京动环监控告警合并', 'NPM告警合并规则', 'APM告警合并规则'
      ],
      'ruleType|1': [
        '合并', '恢复', '分类'
      ],
      'nodeType|1': [
        '数据库',
        '监控对象'
      ],
      'region|1': [
        '北京运维组', 'rootDomain'
      ],
      'priority|1': [
        '中', '低', '高'
      ],
      'exception|1': [ '' ],
      'editSession|1': '@datetime',
      'status|1': [
        '0', '1'
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

// 阈值规则模拟数据
const TRList = (options) => {
  const totalCount = 3
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
      'name|1': [
        '动态基线告警', '巡检任务失败xm', '巡检任务失败bj'
      ],
      'nodeType|1': [
        'AD负载均衡',
        '巡检区域'
      ],
      'node|1': [
        '互联网链路负载', '厦门机房', '北京机房'
      ],
      'region|1': [
        '北京运维组', '厦门运维组'
      ],
      'KPIName|1': [
        '系统当前连接数', '任务状态'
      ],
      'AlertName': [''],
      'level|1': [
        'CRITICAL', 'MAJOR', 'MINOR', 'WARNING', 'INFO'
      ],
      'status|1': [
        '0', '1'
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
Mock.mock(/\/alarmRule\/list/, 'get', alarmRuleList)

Mock.mock(/\/TR\/list/, 'get', TRList)
