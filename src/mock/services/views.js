import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 5701

// 视图列表模拟数据
const viewList = (options) => {
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
      'title|1': [
        'Aix性能', 'BJ-UPS1', 'BJ-UPS4', 'BJ空调1',
        'L2-BJDC综合', 'L2-XMDC综合', 'L2-应用-人力资源',
        'L4-APM性能', 'L4-NPM性能', 'L4-xm-hyperv性能'
      ],
      'type|1': [
        '综合视图', '性能配置视图', '拓扑视图', '告警视图',
        '告警配置视图', '性能监控视图', '三层架构视图', '第三方视图',
        '导航视图', '特殊视图', '报表视图', '插件视图'
      ],
      'author|1': ['administrator', 'admin'],
      'thumbnail|1': ['是', '否']
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
Mock.mock(/\/view\/list/, 'get', viewList)
