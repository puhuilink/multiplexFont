export function nameColumn () {
  return {
    title: '阈值名称',
    dataIndex: 'name',
    width: 300,
    sorter: true
  }
}

export function lastUpdateTime () {
  return {
    title: '更新时间',
    dataIndex: 'last_update_time',
    width: 300,
    sorter: true,
    orderBy: 'descend'
  }
}
