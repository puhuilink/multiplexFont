import { MoreProps } from './index'
import _ from 'lodash'

export const defaultMoreProprietaryConfig = {
  styleConfig: {
    text: '文本',
    textStyle: {
      fontSize: 18,
      color: 'rgba(0,0,0,1)',
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    // defaultColor = '',
    position: {
      mode: 'center'
    }
  }
}
export default class MoreProprietaryConfig {
  constructor ({
    // 对应组件props属性
    props = _.cloneDeep(defaultMoreProprietaryConfig)
  }) {
    this.props = new MoreProps(props)
  }

  /**
   * 映射配置
   */
  getOption () {
    return { ...this.props }
  }
}
