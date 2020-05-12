import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

// 巡更日历模拟数据
const calendarList = () => {
  const result = []
  result.push(Mock.mock({
    'taskList|1-10': [
      {
        'taskTime|+1': [
          ' 7:30', '8:30'
        ],
        'taskName|1': ['北京日常巡更', '厦门日常巡更'],
        'transactorName|+1': ['王彦伟', '李明君'],
        'taskStatus|+1': ['A', 'B', 'C', 'D']
      }
    ],
    'data': '@datetime'
  }))

  return builder({
    data: result
  })
}

const routeList = (options) => {
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
      'wayName|1': [
        '厦门', '厦门巡更路线', '北京-实际路线-对象'
      ],
      'checkArea|1': [
        '北京机房', '厦门机房'
      ],
      'wayCode|1': [
        'LX-2018-07-254F7-5F1D-4273-95', 'LX-2018-07-18FCDA5CB0-A41D-4A',
        'LX-2018-04-11C2A-6D19-49BF-A8'
      ],
      'way|1': [
        'XR01-钢瓶间 — XR02-网络设备接入间B — XR03-配电室B — XR04-配电室B — XR05-空调机房一 — XR06-空调机房一 — XR07-数据机房一 — XR08-数据机房一 — XR09-数据机房一 — XR10-数据机房一 — XR11-数据机房一 — XR12-数据机房一 — XR13-数据机房一 — XR14-数据机房一 — XR15-数据机房一 — XR16-数据机房一 — XR17-数据机房一 — XR18-数据机房一 — XR19-数据机房一 — XR20-数据机房一 — XR21-数据机房一 — XR22-数据机房一 — XR23-配电室A — XR24-配电室A — XR25-网络设备接入间A — XR26-外电室 — XR27-外电室 — XR28-地下室（蓄冷罐） — XR29-屋面 — XR30-屋面 — XR31-屋面 — XR32-七层运维室系统软件检查',
        'XR01-钢瓶间 — XR02-网络设备接入间B — XR03-配电室B — XR04-配电室B — XR05-空调机房一 — XR06-空调机房一 — XR07-数据机房一 — XR08-数据机房一 — XR09-数据机房一 — XR10-数据机房一 — XR11-数据机房一 — XR12-数据机房一 — XR13-数据机房一 — XR14-数据机房一 — XR15-数据机房一 — XR16-数据机房一 — XR17-数据机房一 — XR18-数据机房一 — XR19-数据机房一 — XR20-数据机房一 — XR21-数据机房一 — XR22-数据机房一 — XR23-配电室A — XR24-配电室A — XR25-网络设备接入间A — XR26-外电室 — XR27-外电室 — XR28-地下室（蓄冷罐） — XR29-屋面 — XR30-屋面 — XR31-屋面 — XR32-七层运维室系统软件检查',
        'BR01-机房门 — BR02-机柜38 — BR03-机柜00 — BR04-机柜16 — BR05-机柜37 — BR06-机柜36 — BR07-机柜24 — BR08-机柜17 — BR09-机柜35 — BR10-第三台空调 — BR11-第二台空调 — BR12-第一台空调 — BR13-配电室门 — BR14-UPS1 — BR15-UPS2 — BR16-UPS3 — BR17-UPS4 — BR18-配电室空调'
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

const planList = (options) => {
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
      'planName|1': [
        '2020年度', '厦门巡更'
      ],
      'checkArea|1': [
        '北京机房', '厦门机房'
      ],
      'routeCode|1': [
        'LX-2018-07-254F7-5F1D-4273-95', 'LX-2018-07-18FCDA5CB0-A41D-4A',
        'LX-2018-04-11C2A-6D19-49BF-A8'
      ],
      'executiveGroup|1': [
        '北京监控组', '厦门监控组'
      ],
      'planType|1': [
        '例行巡更'
      ],
      'useing|1': [
        '0', '1'
      ],
      'planCode|1': [
        '21524FC9-5C74-4C73-8874-C4CF555577D0',
        '3EDF6220-B2B7-4709-837F-2F71589F7649'
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

const taskList = (options) => {
  const totalCount = 571
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
      'taskName|1': [
        '2020年度', '厦门巡更'
      ],
      'checkArea|1': [
        '北京机房', '厦门机房'
      ],
      'inspectionDate': '@date',
      'executionTime': '@time',
      'takState|1': [
        '0', '1', '2', '3', '4'
      ],
      'taskType|1': [
        '例行巡更'
      ],
      'abnormal|1': [
        '0', '1'
      ],
      'executor|1': [
        '李沛伦', '王彦伟'
      ],
      'delayedStart|1': [
        '0', '1'
      ],
      'beginTime': '@dateTime',
      'endTime': '@dateTime',
      'defaultExecutorDo|1': [
        '0', '1'
      ],
      'defaultExecutor|1': [
        '刘昶', '李明君', '王金凤', '李沛伦'
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

const objList = (options) => {
  const totalCount = 571
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
        '机房门', '	BJDSA38', 'BJDSA08', 'BJDSA07'
      ],
      'checkArea|1': [
        '北京机房', '厦门机房'
      ],
      'abnormal|1': [
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

const objInfo = (options) => {
  const totalCount = 4
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
        '配电室门关闭', '	配电室门完好', '机房门关闭', '机房门完好'
      ],
      'result|1': [
        '0', '1'
      ],
      'abnormal|1': [
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
Mock.mock(/\/calendar\/list/, 'get', calendarList)
Mock.mock(/\/route\/list/, 'get', routeList)
Mock.mock(/\/plan\/list/, 'get', planList)
Mock.mock(/\/task\/list/, 'get', taskList)
Mock.mock(/\/obj\/list/, 'get', objList)
Mock.mock(/\/obj\/info/, 'get', objInfo)
