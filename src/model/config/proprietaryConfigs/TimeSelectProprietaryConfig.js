import { UpsProps } from './index'
import _ from 'lodash'
import TimeSelectElement from '@/model/element/TimeSelectElement'

export const defaultTimeSelectProprietaryConfig = {
  styleConfig: {
    timeType: 'hour'
  }
}
export default class TimeSelectProprietaryConfig {
  constructor ({
    // 对应组件props属性
    props = _.cloneDeep(defaultTimeSelectProprietaryConfig)
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
