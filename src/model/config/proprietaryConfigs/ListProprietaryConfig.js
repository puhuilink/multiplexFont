import _ from 'lodash'
import { ListProps } from './index'

export default class ListProprietaryConfig {
  constructor ({
    // 对应组件props属性
    props = {}
  }) {
    this.props = new ListProps(props)
  }

  /**
   * 映射配置
   */
  getOption () {
    return { ..._.omit(this, ['props']) }
  }
}
