import { UpsProps } from './index'
import _ from 'lodash'

export const defaultUpsProprietaryConfig = {
  styleConfig: {
    addr: 'http://192.168.1.228/ups/#/80KVA'
  }
}
export default class UpsProprietaryConfig {
  constructor ({
    // 对应组件props属性
    props = _.cloneDeep(defaultUpsProprietaryConfig)
  }) {
    this.props = new UpsProps(props)
  }

  /**
   * 映射配置
   */
  getOption () {
    return { ...this.props }
  }
}
