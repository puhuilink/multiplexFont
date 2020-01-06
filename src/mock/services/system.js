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

Mock.mock(/\/user\/list/, 'get', userList)
