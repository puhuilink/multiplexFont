import _ from 'lodash'
import { SeriesGauge } from './index'

const defaultInsideSeries = {
  type: 'gauge',
  axisLine: {
    lineStyle: {
      color: [[1, 'rgba(255, 255, 255, 1)']],
      width: 3,
      shadowColor: 'transparent',
      shadowBlur: 10
    }
  },
  axisLabel: {
    fontWeight: 'bolder',
    color: '#fff',
    shadowColor: 'transparent',
    shadowBlur: 10
  },
  axisTick: {
    length: 12,
    lineStyle: {
      color: 'rgba(255, 255, 255, 1)',
      shadowColor: 'transparent',
      shadowBlur: 10
    }
  },
  data: [
    {
      value: 0,
      name: 'km/h',
      itemStyle: {
        color: 'rgba(39, 131, 144, 1)',
        backgroundColor: 'transparent'
      }
    }],
  detail: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowBlur: 5,
    offsetCenter: [0, '50%'],
    textStyle: {
      fontWeight: 'bolder',
      color: '#fff'
    }
  },
  max: 100,
  min: 0,
  pointer: {
    shadowColor: 'transparent',
    shadowBlur: 5,
    length: 130,
    width: 5
  },
  radius: '55%',
  splitNumber: 10,
  splitLine: {
    length: 14,
    lineStyle: {
      width: 4,
      color: 'rgba(255, 255, 255, 1)',
      shadowColor: 'transparent',
      shadowBlur: 10
    }
  },
  title: {
    textStyle: {
      fontWeight: 'bolder',
      fontSize: 20,
      fontStyle: 'italic',
      color: '#fff',
      shadowColor: 'transparent',
      shadowBlur: 10,
      text: 'text'
    }
  }
}

const defaultOutSideSeries = _.cloneDeep(Object.assign({}, defaultInsideSeries, {
  axisLabel: {
    show: false
  },
  axisTick: {
    length: 12,
    lineStyle: {
      color: 'rgba(25, 123, 183, 1)',
      shadowColor: 'transparent',
      shadowBlur: 10
    }
  },
  axisLine: {
    lineStyle: {
      color: [[1, 'rgba(28, 136, 196, 1)']],
      width: 3,
      shadowColor: 'transparent',
      shadowBlur: 10
    }
  },
  data: [],
  detail: {
    show: false
  },
  pointer: {
    show: false
  },
  radius: '80%',
  splitLine: {
    ...defaultInsideSeries.splitLine,
    lineStyle: {
      ...defaultInsideSeries.splitLine.lineStyle,
      color: 'rgba(25, 123, 183, 1)'
    }
  },
  title: {
    show: false
  }
}))

/**
 * 仪表盘专有属性配置
 */
export default class GaugeProprietaryConfig {
  constructor ({
    series = _.cloneDeep([defaultInsideSeries, defaultOutSideSeries]),
    decimalPoint = -1
  }) {
    this.series = series.map(s => new SeriesGauge(s))
    this.decimalPoint = decimalPoint
  }

  /**
   * 获取文本专有配置
   */
  getOption () {
    return Object.assign({}, this, {
      series: this.series
    })
  }
}
