// 系统设置模块接口数据

import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const userList = (options) => {
  const totalCount = 10
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
      'loginName|1': [
        'xmhelpdesk', 'xiongzifu', 'xiamenIT',
        'wangzhongyou'
      ],
      'name|1': [
        '厦门大屏', '王忠友', '王彦伟', '王金凤'
      ],
      'position|1': [
        '厦门大屏展示专有用户', '厦门运维', '北京运维', '北京运维负责人'
      ],
      'officePhone': '',
      'mobilePhone': '',
      'Email': '@email'
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

const groupList = (options) => {
  const totalCount = 8
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
      'code|1': [
        'xiamenjiankongzu', 'processPlatform',
        'beijingjiankongzu', 'administrator',
        '59978400870000'
      ],
      'name|1': [
        '厦门监控组',
        '服务管理流程组',
        '北京监控组',
        '超级管理员组',
        '管理员组'
      ],
      'boolUse|1': '有效',
      'remark|1': [
        '仅供厦门数据中心运维人员使用，可浏览厦门数据中心相关配置项及视图告警。',
        '本组内成员可从监控平台主菜单“服务管理”处，携带跳转前用户名跳转至服务流程管理平台。具有该用户在ITSM平台的相应权限。非本组用户跳转无效。',
        '仅供北京数据中心运维人员使用，可浏览北京数据中心相关配置项及视图告警。',
        '系统默认的超级管理员组。 仅限运维本监控平台的超级管理员使用。',
        'IT运维主管领导专用，可同时跨数据中心访问多地监控视图及告警情况。'
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

const auditList = (options) => {
  const totalCount = 300
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
      'code': 2471 + tmpKey,
      'modelName|1': [
        '统一用户管理',
        '告警模块'
      ],
      'operateId|1': ['administrator', 'wangzhongyou'],
      'clientIP|1': [
        '10.1.168.50', '10.88.76.102', '10.1.200.230'
      ],
      'functionName|1': [
        '用户登录', '告警操作'
      ],
      'operateTime': '@datetime',
      'operateContent': [
        '用户administrator登陆了viportal系统',
        '用户登出了系统',
        '执行了告警操作xxxxx'
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
Mock.mock(/\/user\/list/, 'get', userList)
Mock.mock(/\/group\/list/, 'get', groupList)
Mock.mock(/\/audit\/list/, 'get', auditList)
