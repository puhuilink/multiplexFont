import { SelectProps } from './index'
import _ from 'lodash'

export const defaultSelectProprietaryConfig = {
  styleConfig: {
    size: 'default',
    type: 'sdwan'
  }
}
export default class SelectProprietaryConfig {
  constructor ({
    // 对应组件props属性
    props = _.cloneDeep(defaultSelectProprietaryConfig)
  }) {
    this.props = new SelectProps(props)
  }

  /**
   * 映射配置
   */
  getOption () {
    return { ...this.props }
  }
}
