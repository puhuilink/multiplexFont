import _ from 'lodash'
import { SeriesGauge } from './index'

/**
 * 仪表盘专有属性配置
 */
export default class GaugeProprietaryConfig {
  constructor ({
    series = {
      name: '速度',
      type: 'gauge',
      min: 0,
      max: 220,
      splitNumber: 11,
      radius: '80%',
      axisLine: { // 坐标轴线
        lineStyle: { // 属性lineStyle控制线条样式
          color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
          width: 3,
          shadowColor: '#fff', // 默认透明
          shadowBlur: 10
        }
      },
      axisLabel: { // 坐标轴小标记
        fontWeight: 'bolder',
        color: '#fff',
        shadowColor: '#fff', // 默认透明
        shadowBlur: 10
      },
      axisTick: { // 坐标轴小标记
        length: 15, // 属性length控制线长
        lineStyle: { // 属性lineStyle控制线条样式
          color: 'auto',
          shadowColor: '#fff', // 默认透明
          shadowBlur: 10
        }
      },
      splitLine: { // 分隔线
        length: 25, // 属性length控制线长
        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
          width: 3,
          color: '#fff',
          shadowColor: '#fff', // 默认透明
          shadowBlur: 10
        }
      },
      pointer: { // 分隔线
        shadowColor: '#fff', // 默认透明
        shadowBlur: 5
      },
      title: {
        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          fontWeight: 'bolder',
          fontSize: 20,
          fontStyle: 'italic',
          color: '#fff',
          shadowColor: '#fff', // 默认透明
          shadowBlur: 10,
          text: 'text'
        }
      },
      detail: {
        backgroundColor: 'rgba(30,144,255,0.8)',
        borderWidth: 1,
        borderColor: '#fff',
        shadowColor: '#fff', // 默认透明
        shadowBlur: 5,
        offsetCenter: [0, '50%'], // x, y，单位px
        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
          fontWeight: 'bolder',
          color: '#fff'
        }
      },
      data: [{ value: 0, name: 'km/h' }]
    }
  }) {
    this.series = new SeriesGauge(series)
  }

  /**
   * 获取文本专有配置
   */
  getOption () {
    return Object.assign(_.cloneDeep(this), {
      series: this.series
    })
  }
}
