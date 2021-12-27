import { TabProps } from './index'
import _ from 'lodash'

export const defaultTabProprietaryConfig = {
  styleConfig: {
  }
}
export default class TabProprietaryConfig {
  constructor ({
    // 对应组件props属性
    props = _.cloneDeep(defaultTabProprietaryConfig)
  }) {
    this.props = new TabProps(props)
  }

  /**
   * 映射配置
   */
  getOption () {
    return { ...this.props }
  }
}
