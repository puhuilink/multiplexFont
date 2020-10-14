import _ from 'lodash'
import { Title } from './index'
import moment from 'moment'

// 默认轴线配置，不显示轴线
const defaultAxis = {
  show: false
}

/**
 * 时钟专有属性配置
 */
export default class ClockProprietaryConfig {
  constructor ({
    title = {
      text: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    xAxis = defaultAxis,
    yAxis = defaultAxis,
    format = 'YYYY-MM-DD HH:mm:ss'
  }) {
    this.title = new Title(title)
    this.xAxis = xAxis
    this.yAxis = yAxis
    this.format = format
  }

  /**
   * 获取文本专有配置
   */
  getOption () {
    return Object.assign({}, _.cloneDeep(this), {
      title: this.title.getOption(),
      format: this.format
    })
  }
}
