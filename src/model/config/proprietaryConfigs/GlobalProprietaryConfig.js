import { allData } from '../../data/map'
import 'echarts/map/js/world.js'
import echarts from 'echarts'

export default class GlobalProprietaryConfig {
  constructor ({
    // 地图底图背景颜色
    backgroundColor = '#323c48',
    // 版图颜色
    areaColor = '#01588E',
    // 移入版图颜色
    hoverColor = '#fff',
    // 版图边缘颜色
    borderColor = '#404a59',
    // 连线颜色渐变始
    lineColor = ['#58B3CC', '#ffbf31'],
    // 连线颜色渐变终
    // 版图文字颜色
    fontColor = '#000'
  }) {
    this.backgroundColor = backgroundColor
    this.areaColor = areaColor
    this.borderColor = borderColor
    this.lineColor = lineColor
    this.fontColor = fontColor
    this.hoverColor = hoverColor
  }

  /**
   * 映射配置
   */
  getOption () {
    return {
      backgroundColor: this.backgroundColor,
      title: {
        text: '',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        show: true,
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        data: ['地区', '线路'],
        textStyle: {
          color: '#fff'
        }
      },
      geo: {
        map: 'world',
        label: {
          color: this.fontColor,
          emphasis: {
            show: true
          }
        },
        roam: true,
        center: [115.7, 39.4],
        zoom: 5,
        itemStyle: {
          normal: {
            areaColor: this.areaColor,
            borderColor: this.borderColor
          },
          emphasis: {
            areaColor: this.hoverColor
          }
        }
      },
      series: [{
        name: '地点',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          brushType: 'fill'
        },
        label: {
          emphasis: {
            show: true,
            position: 'left',
            formatter: '{b}'
          }
        },
        symbolSize: 2,
        showEffectOn: 'render',
        itemStyle: {
          normal: {
            color: '#46bee9'
          }
        },
        data: allData.citys
      }, {
        name: '省份',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          brushType: 'fill'
        },
        label: {
          // emphasis: {
          //   show: true,
          //   position: 'left',
          //   formatter: '{b}'
          // }
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        symbolSize: 2,
        showEffectOn: 'render',
        itemStyle: {
          normal: {
            color: '#46bee9'
          }
        },
        data: allData.citys
      }, {
        name: '线路',
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 2,
        large: true,
        effect: {
          show: true,
          constantSpeed: 30,
          symbol: 'pin',
          symbolSize: 3,
          trailLength: 0
        },
        lineStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: this.lineColor[0]
            }, {
              offset: 1,
              color: this.lineColor[1]
            }], false),
            width: 1,
            opacity: 0.3,
            curveness: 0.1
          }
        }
      }]
    }
  }
}
