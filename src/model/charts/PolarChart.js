/**
* 极坐标
* Date: 2020/5/15
* Time: 5:11 下午
*/

import _ from 'lodash'
import Chart from './index'

export default class PolarChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  /**
   * 映射成 echarts 配置项
   * @param {Boolean} loadingDynamicData 是否请求动态数据
   * @return {Promise<any>}
   */
  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { grid } = commonConfig.getOption()
    const {
      legend, polarLinearColors, angleAxis,
      radiusAxis, radar, polar, polarMask,
      itemStyle: { color }
    } = proprietaryConfig.getOption()
    const { sourceType, staticDataConfig: { staticData }, dbDataConfig } = dataConfig

    const series = []
    // 总体配置
    const option = { color, grid, legend, series }

    const bar = {
      type: 'bar',
      zlevel: 3,
      coordinateSystem: 'polar'
    }

    const pie = {
      name: '',
      type: 'pie',
      radius: ['20%', '80%'],
      avoidLabelOverlap: false,
      zlevel: 1,
      silent: true,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: polarLinearColors
    }

    const mask = {
      name: 'mask',
      type: 'pie',
      radius: ['20%', '80%'],
      avoidLabelOverlap: false,
      zlevel: 5,
      silent: true,
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      data: []
    }

    switch (sourceType) {
      case 'static': {
        const {
          legend: staticLegend,
          series: staticSeries,
          angleAxis: staticAngleAxis
        } = staticData

        const maskData = [polarMask.item, ...staticSeries[0].data.map(item => ({
          value: 1,
          name: 'mask',
          itemStyle: {
            color: 'rgba(0, 0, 0, 0)'
          }
        })), polarMask.item]
        mask.data = maskData

        const caculateSeries = _.cloneDeep(staticSeries).map(item => {
          return Object.assign(item, bar, polarMask.show ? { data: [0, ...item.data, 0] } : {})
        })

        Object.assign(option,
          {
            legend: Object.assign(legend, staticLegend),
            series: [...caculateSeries, Object.assign(pie, polar), Object.assign(mask, polar)],
            angleAxis: Object.assign(angleAxis, staticAngleAxis, { data: polarMask.show ? ['', ...staticAngleAxis.data, ''] : staticAngleAxis.data }),
            radar: Object.assign(radar, {
              indicator: [...angleAxis.data].map(() => ({ text: '' }))
            }),
            radiusAxis,
            polar
          }
        )
        break
      }
      case 'null': {
        break
      }
      case 'real': {
        const {
          legend: dynamicLegend,
          series: dynamicSeries,
          angleAxis: dynamicAngleAxis
        } = await dbDataConfig.getOption(loadingDynamicData)

        if (dynamicSeries && dynamicSeries[0] && dynamicSeries[0].data && dynamicSeries[0].data.length > 0) {
          const maskData = [polarMask.item, ...dynamicSeries[0].data.map(item => ({
            value: 1,
            name: 'mask',
            itemStyle: {
              color: 'rgba(0, 0, 0, 0)'
            }
          })), polarMask.item]
          mask.data = maskData

          const caculateSeries = _.cloneDeep(dynamicSeries).map(item => {
            return Object.assign(item, bar, polarMask.show ? { data: [0, ...item.data, 0] } : {})
          })

          Object.assign(option,
            {
              legend: Object.assign(legend, dynamicLegend),
              series: [...caculateSeries, Object.assign(pie, polar), Object.assign(mask, polar)],
              angleAxis: Object.assign(angleAxis, dynamicAngleAxis, { data: polarMask.show ? ['', ...dynamicAngleAxis.data, ''] : dynamicAngleAxis.data }),
              radar: Object.assign(radar, {
                indicator: [...angleAxis.data].map(() => ({ text: '' }))
              }),
              radiusAxis,
              polar
            }
          )
        }
        break
      }
    }
    return Object.assign({}, option, {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      }
    })
  }
}
