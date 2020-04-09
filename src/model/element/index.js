/**
* 元素
* Author: dong xing
* Date: 2020/4/8
* Time: 11:24
* Email: dong.xing@outlook.com
*/

import _ from 'lodash'
import anime from 'animejs'
import store from '@/store'
import { ScreenMutations } from '@/store/modules/screen'

export default class Element {
  constructor ({ widget, element }) {
    this.container = document.getElementById(widget.widgetId)
    this.element = element
    this.setContainer(widget)
    this.setStyle(widget.config)
    this.widget = widget
  }

  /**
   * 初始设置容器位置尺寸
   * @param config
   */
  setContainer ({ config }) {
    const {
      width, height, top, left, zIndex
    } = config.commonConfig
    anime.set(this.container, {
      width,
      height,
      top,
      left,
      zIndex
    })
  }

  /**
   * 设置基本样式
   * @param config
   */
  setStyle (config) {
    const {
      colorMode, backgroundColor, border
    } = config.commonConfig
    anime.set(this.container, {
      ...border.getOption(),
      background: colorMode === 'single' ? backgroundColor : `linear-gradient(${backgroundColor.angle}deg, ${backgroundColor.start}, ${backgroundColor.end})`
    })
    this.mergeOption(config)
  }

  /**
   * 设置专有属性样式，与图表对象使用同一方法m名
   */
  mergeOption (config, loadingDynamicData = false) {}

  /**
   * 更新元素组件的props
   * @param props
   */
  updateProps (props) {
    if (this.widget) {
      const widget = Object.assign(_.cloneDeep(this.widget), { render: this.widget.render })
      Object.assign(widget.config.proprietaryConfig.props, props)
      store.commit(`screen/${ScreenMutations.ACTIVATE_WIDGET}`, { widget })
    }
  }

  refresh () {
    this.mergeOption(this.widget.config, true)
  }

  /**
   * 轮询
   */
  intervalRefresh () {
    this.refresh()
    // 存在自动刷新时间设置则开启定时刷新
    const refreshTime = _.get(this, 'widget.config.dataConfig.dbDataConfig.refreshTime')
    if (refreshTime > 0) {
      this.timer = setInterval(() => this.refresh(), Number(refreshTime) * 1000 * 60
      )
    }
  }

  resize () {}

  destroy () {
    clearInterval(this.timer)
  }
}
