/**
* 元素
* Author: dong xing
* Date: 2020/4/8
* Time: 11:24
* Email: dong.xing@outlook.com
*/

import anime from 'animejs'
import ListElementComponent from '~~~/Elements/ListElement'
import Vue from 'vue'
import store from '@/store'
import { ScreenMutations } from '@/store/modules/screen'
import _ from 'lodash'

const ELEMENT_MAPPING = new Map([
  ['List', ListElementComponent]
])

export default class Element {
  constructor ({ widget, element }) {
    this.container = document.getElementById(widget.widgetId)
    this.element = element
    this.setContainer(widget)
    this.setStyle(widget.config)
    this.widget = widget
    // 初始化配置
    this.mergeOption(widget.config)
    const componentOption = ELEMENT_MAPPING.get(this.widget.config.type)
    this.$component = new Vue(componentOption).$mount(this.element)
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
  }

  async mergeOption (config, loadingDynamicData = false) {
    this.$component.elementProps = await this.mappingOption(config, loadingDynamicData)
    if (this.widget) {
      const { render, ...rest } = this.widget
      const widget = Object.assign({}, _.cloneDeep(rest), { render })
      Object.assign(widget.config, {
        ...config
      })
      store.commit(`screen/${ScreenMutations.ACTIVATE_WIDGET}`, { widget })
    }
  }

  /**
   * 设置专有属性样式，与图表对象使用同一方法m名
   */
  mappingOption (config, loadingDynamicData = false) {}

  refresh () {
    this.mergeOption(this.widget.config, true)
  }

  /**
   * 完整配置设置
   * @param config
   */
  setConfig (config) {
    this.setStyle(config)
    this.mergeOption(config)
  }

  resize () { }

  destroy () {
    const { $component } = this
    $component && $component.$destroy()
    this.$component = null
  }
}
