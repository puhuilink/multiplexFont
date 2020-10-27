import _ from 'lodash'

const defaultListElementStaticData = {
  columns: [
    { title: 'ID', dataIndex: 'id', width: '20%' },
    { title: 'Name', dataIndex: 'name', width: '20%' },
    { title: 'Age', dataIndex: 'age', width: '20%' }
  ],
  dataSource: [
    { id: 1, name: 'John', age: 25 },
    { id: 2, name: 'Annie', age: 17 },
    { id: 3, name: 'Bob', age: 28 },
    { id: 4, name: 'Steve', age: 22 },
    { id: 5, name: 'Ozzy', age: 27 },
    { id: 6, name: 'Paul', age: 23 },
    { id: 7, name: 'Krik', age: 20 },
    { id: 8, name: 'Govan', age: 19 },
    { id: 9, name: 'Joe', age: 20 },
    { id: 10, name: 'Justin', age: 25 }
  ]
}

export default class ListElementStaticDataConfig {
  constructor ({
    staticData = defaultListElementStaticData
  } = {}) {
    this.staticData = staticData
  }

  getCode () {
    const { columns = [], dataSource = [] } = this.staticData
    return JSON.stringify({
      columns: columns.map(column => _.pick(column, ['title', 'dataIndex', 'width'])),
      dataSource
    }, null, '\t')
  }
}
