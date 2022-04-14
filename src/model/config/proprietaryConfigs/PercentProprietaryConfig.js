import _ from 'lodash'

export default class PercentProprietaryConfig {
  constructor ({
    style = {
      isOneColor: false,
      lineOneColor: '#fff',
      lineGradColor: [
        '#fff', '#000'
      ]
    },
    innerTable = {
      show: false,
      columns: [{ title: '', dataIndex: '' }],
      sql: '',
      title: ''
    }
  }) {
    this.style = style
    this.innerTable = innerTable
  }

  /**
   * 映射配置
   */
  getOption () {
    return _.cloneDeep(this)
  }
}
