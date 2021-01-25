/**
* 图片
* Author: dong xing
* Date: 2020/3/25
* Time: 10:02
* Email: dong.xing@outlook.com
*/

import Chart from './index'

export default class ImageChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
    this.chart.on('dblclick', () => {
      const tmpLink = this.config.proprietaryConfig.graphic.link
      const tmpTarget = this.config.proprietaryConfig.graphic.target
      if (!tmpLink) {
        return
      }

      if (tmpTarget === 'blank') {
        window.open(tmpLink, '_blank')
      } else {
        window.location.href = tmpLink
      }
    })
  }

  resize (config) {
    if (config) {
      this.chart.resize()
      this.mergeOption(config)
    }
  }

  /**
   * 映射成 echarts 配置项
   */
  mappingOption ({ commonConfig, proprietaryConfig }) {
    const padding = commonConfig.getPadding()
    const graphic = proprietaryConfig.getOption(this.chart, padding)
    return { graphic }
  }
}
