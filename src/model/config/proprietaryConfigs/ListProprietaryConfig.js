import { ListProps } from './index'
import _ from 'lodash'

export const defaultListProprietaryConfig = {
  styleConfig: {
    header: {
      backgroundColor: 'rgba(230,230,230,1)',
      color: 'rgba(80,80,80,1)',
      fontSize: '12px',
      fontWeight: 'normal'
    },
    rows: {
      backgroundColor: {
        odd: 'rgba(230,230,230,1)',
        even: 'rgba(220,220,220,1)'
      },
      color: 'rgba(112,116,120,1)',
      fontSize: '12px',
      fontWeight: 'normal'
    },
    align: 'left'
  }
}
export default class ListProprietaryConfig {
  constructor ({
    // 对应组件props属性
    props = _.cloneDeep(defaultListProprietaryConfig)
  }) {
    this.props = new ListProps(props)
  }

  /**
   * 映射配置
   */
  getOption () {
    return { ...this.props }
  }
}
