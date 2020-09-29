/**
* 图片专有配置
* Author: dong xing
* Date: 2020/3/25
* Time: 10:03
* Email: dong.xing@outlook.com
*/

import { ImageGraphic } from './index'

export default class ImageProprietaryConfig {
  constructor ({
    graphic = {
      style: {
        image: './view__preview_default.jpg'
      }
    }
  }) {
    this.graphic = new ImageGraphic(graphic)
  }

  getOption (chart, padding) {
    return this.graphic.getOption(chart, padding)
  }
}
