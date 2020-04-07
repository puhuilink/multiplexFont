/**
* 告警列表专属配置
* Author: dong xing
* Date: 2020/4/7
* Time: 10:38
* Email: dong.xing@outlook.com
*/
import _ from 'lodash'
import { AlarmListProps } from './index'

export default class AlarmListProprietaryConfig {
  constructor ({
    // 对应组件props属性
    props = {}
  }) {
    this.props = new AlarmListProps(props)
  }

  /**
   * 映射配置
   */
  getOption () {
    return { ..._.omit(this, ['props']) }
  }
}
