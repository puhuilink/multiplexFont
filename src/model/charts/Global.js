import Chart from '@/model/charts/index'
import 'echarts/map/js/china.js'
import { SOURCE_TYPE_ORM, SOURCE_TYPE_STATIC } from '@/model/config/dataConfig/dynamicData/types/sourceType'
// import { axios } from '@/utils/request'
// const ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples'
import _ from 'lodash'
import echarts from 'echarts'
export default class PieChart extends Chart {
  constructor ({ widget }) {
    super({ widget })
  }

  async mappingOption ({ commonConfig, proprietaryConfig, dataConfig }, loadingDynamicData = false) {
    const { sourceType } = dataConfig
    const allData = {}
    const node = []
    const moveLine = []
    switch (sourceType) {
      case SOURCE_TYPE_STATIC: {
        break
      }
      case SOURCE_TYPE_ORM: {
        console.log('before')
        const { connection } = await dataConfig.dbDataConfig.getOption(loadingDynamicData, sourceType)
        console.log('after')
        if (connection === 'data') {
          return {}
        }
        const originLat = _.get(connection, ['0', 'originLat'])
        const originLng = _.get(connection, ['0', 'originLng'])
        const originName = _.get(connection, ['0', 'originName'])
        node.push({
          name: originName,
          value: [Number(originLng), Number(originLat), 2],
          symbolSize: 5,
          itemStyle: {
            'normal': {
              'color': '#FFBF31'
            }
          }
        })
        connection.map(el => {
          // let { peer: { originLat, originLng, originName } } = el
          if (el.peerNode) {
            const { peerNode: { peerName: { name, lat, lng } } } = el
            node.push({
              name: name,
              value: [Number(lng), Number(lat), 2],
              symbolSize: 2,
              itemStyle: {
                'normal': {
                  'color': '#58B3CC'
                }
              }
            })
            moveLine.push({
              fromName: originName,
              toName: name,
              coords: [[Number(originLng), Number(originLat)], [Number(lng), Number(lat)]]
            })
          }
        })
        Object.assign(allData, { 'city': node })
      }
    }
    const option = proprietaryConfig.getOption()
    option.series[0].data = node
    option.series[1].data = moveLine
    return option
  }

  async mergeOption (config, loadingDynamicData = false) {
    this.chart.dispose()
    this.chart = echarts.init(this.container, '', {
      renderer: 'canvas'
    })
    this.chartConfig = await this.mappingOption(config, loadingDynamicData)
    // 如果数据为空则清空图表
    if (_.isEmpty(this.chartConfig.series)) {
      this.chart.clear()
    }
    // 重新配置图表
    // https://github.com/apache/incubator-echarts/issues/3976
    this.chart.setOption(this.chartConfig)
  }
}
