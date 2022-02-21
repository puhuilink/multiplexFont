<template>
  <div>
    <div v-if="component">
      切换目标站点：<a-select show-search :filter-option="filterOption" style="width: 300px;margin-bottom: 40px" @change="onSelectChange" :value="peerSiteId">
        <a-select-option v-for="(site,index) in siteList" :value="site.id" :key="index">{{ site.name }}</a-select-option>
      </a-select>
    </div>
    <a-tabs type="card" :style="{ width: '100%'}" @change="reloadEcharts">
      <a-tab-pane v-for="(e,index) in columns" :key="index" :tab="e">
        <div :id="getId()+index.toString()" :style="{ width: width+'px', height: height+'px' }"></div>
        <a-pagination
          v-if="component"
          v-model="current"
          :total="args.size"
          show-size-changer
          :pageSize="pageSize"
          @showSizeChange="onShowSizeChange"
          @change="onChange"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
// import MoreProprietaryConfig from '@/model/config/proprietaryConfigs/MoreProprietaryConfig'

import _ from 'lodash'
import echarts from 'echarts'
import uuid from 'uuid/v4'
import { SdwanSiteService } from '@/api'

export default {
  name: 'TabElement',
  props: {
    cols: {
      type: Array,
      default: () => []
    },
    pd: {
      type: Object,
      default: () => ({})
    },
    component: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    args: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      // styleConfig: new MoreProprietaryConfig({}),
      elementProps: {
        styleConfig: {}
      },
      styleConfig: {},
      fatherStyle: {},
      columns: ['空'],
      dataSource: [],
      visible: false,
      myChart: null,
      activeKey: 0,
      width: 100,
      height: 100,
      widgetId: null,
      grid: null,
      peerSiteId: null,
      current: 1,
      pageSize: 5,
      siteList: []
    }
  },
  watch: {
    'elementProps.styleConfig': {
      immediate: true,
      deep: true,
      handler (value) {
        this.styleConfig = _.cloneDeep(value)
        this.reloadEcharts(this.activeKey)
      }
    },
    'elementProps.data.columns': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          if (value.length < 1) {
            this.columns = ['']
          } else {
            const t = []
            for (let i = 0; i < value.length; i++) {
              t.push(value[i])
            }
            this.columns = t
          }
        } else {
          this.columns = ['']
        }
      }
    },
    'elementProps.data.dataSource': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.dataSource = value
        }
      }
    },
    'elementProps.common': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          const { grid } = value.getOption()
          this.grid = grid
          this.width = value.width * 0.9
          this.height = value.height * 0.9
          this.reloadEcharts(this.activeKey)
        }
      }
    },
    'show': {
      immediate: true,
      deep: true,
      async handler (value) {
        if (value) {
          this.peerSiteId = null
          await this.reloadData(this.args.siteId, this.peerSiteId, this.args.type)
          this.styleConfig = {
            'barType': 'single',
            'legend': {
              'show': true,
              'orient': 'horizontal',
              'top': 'auto',
              'right': '25',
              'bottom': 'auto',
              'left': 'auto',
              'icon': 'circle',
              'textStyle': {
                'color': 'rgba(0, 0, 0, 1)',
                'fontStyle': 'normal',
                'fontSize': 12,
                'fontWeight': 'normal'
              },
              'type': 'plain'
            },
            'barItemStyle': {
              'type': 'combination',
              'colorType': 'default',
              'colorScheme': 'default',
              'color': [
                '#c23531',
                '#2f4554',
                '#61a0a8',
                '#d48265',
                '#91c7ae',
                '#749f83',
                '#ca8622',
                '#bda29a',
                '#6e7074',
                '#546570',
                '#c4ccd3'
              ],
              'barBorderRadius': [
                0,
                0,
                0,
                0
              ]
            },
            'barWidthType': 'custom',
            'barWidth': 12,
            'xAxis': {
              'show': false,
              'type': 'value',
              'boundaryGap': true,
              'showName': false,
              'name': '',
              'nameLocation': 'end',
              'nameTextStyle': {
                'color': 'rgba(0, 0, 0, 1)',
                'fontStyle': 'normal',
                'fontSize': 12,
                'fontWeight': 'normal'
              },
              'nameGap': 15,
              'gridIndex': 1,
              'axisLine': {
                'show': true,
                'lineStyle': {
                  'color': 'rgba(0,0,0,1)',
                  'width': 2,
                  'type': 'solid'
                }
              },
              'axisTick': {
                'show': true,
                'length': 5,
                'lineStyle': {
                  'color': 'rgba(0,0,0,1)',
                  'width': 2,
                  'type': 'solid'
                }
              },
              'axisLabel': {
                'color': 'rgba(0, 0, 0, 1)',
                'fontStyle': 'normal',
                'fontSize': 12,
                'fontWeight': 'normal',
                'show': true,
                'rotate': 0,
                'margin': 8
              },
              'splitLine': {
                'show': false,
                'lineStyle': {
                  'color': 'rgba(30,30,30,1)',
                  'width': 2,
                  'type': 'solid'
                }
              },
              'axisName': 'x',
              'position': 'bottom'
            },
            'yAxis': {
              'show': true,
              'type': 'category',
              'boundaryGap': true,
              'showName': false,
              'name': '',
              'nameLocation': 'end',
              'nameTextStyle': {
                'color': 'rgba(0, 0, 0, 1)',
                'fontStyle': 'normal',
                'fontSize': 12,
                'fontWeight': 'normal'
              },
              'nameGap': 15,
              'gridIndex': 1,
              'axisLine': {
                'show': false,
                'lineStyle': {
                  'color': 'rgba(0,0,0,1)',
                  'width': 2,
                  'type': 'solid'
                }
              },
              'axisTick': {
                'show': false,
                'length': 5,
                'lineStyle': {
                  'color': 'rgba(0,0,0,1)',
                  'width': 2,
                  'type': 'solid'
                }
              },
              'axisLabel': {
                'color': 'rgba(0, 0, 0, 1)',
                'fontStyle': 'normal',
                'fontSize': 12,
                'fontWeight': 'normal',
                'show': true,
                'rotate': 0,
                'margin': 8
              },
              'splitLine': {
                'show': false,
                'lineStyle': {
                  'color': 'rgba(0,0,0,1)',
                  'width': 2,
                  'type': 'solid'
                }
              },
              'axisName': 'y',
              'position': 'left'
            },
            'reverse': true,
            'decimalPoint': -1
          }
          this.grid = [
            {
              'show': true,
              'top': 0,
              'right': 0,
              'bottom': 0,
              'left': 0,
              'backgroundColor': 'transparent',
              'borderWidth': 0
            },
            {
              'show': true,
              'top': 30,
              'right': 45,
              'bottom': 55,
              'left': 200,
              'borderWidth': 0,
              'backgroundColor': 'transparent'
            }
          ]
          this.width = 1080
          this.height = 450
          await this.reloadEcharts(this.activeKey)
        }
      }
    },
    'args.siteId': {
      immediate: true,
      deep: true,
      async handler (value) {
        if (value) {
          this.siteList = await SdwanSiteService.getPeerSite(value)
        }
      }
    }
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    async onShowSizeChange (current, pageSize) {
      this.current = 1
      this.pageSize = pageSize
      await this.reloadData(this.args.siteId, this.peerSiteId, this.args.type, this.pageSize, 0)
      await this.reloadEcharts(this.activeKey)
    },
    async onChange (current) {
      this.current = current
      await this.reloadData(this.args.siteId, this.peerSiteId, this.args.type, this.pageSize, (this.current - 1) * this.pageSize)
      await this.reloadEcharts(this.activeKey)
    },
    async onSelectChange (value) {
      this.peerSiteId = value
      await this.reloadData(this.args.siteId, this.peerSiteId, this.args.type)
      await this.reloadEcharts(this.activeKey)
    },
    async reloadData (siteId, peerSiteId, type, limit, offset) {
      const result = await SdwanSiteService.getConnection({ siteId, peerSiteId, type, limit, offset })
      this.args.size = result.size
      Object.assign(this, this.generateStaticData(result))
    },
    generateStaticData (dataList = [], reverse = false) {
      let columns = []
      let dataSource = []
      if (_.isEmpty(dataList)) {
        return { columns, dataSource }
      }
      const { data } = dataList
      columns = Object.keys(data)
      dataSource = data
      return { columns, dataSource }
    },
    async reloadEcharts (key) {
      await this.$nextTick()
      this.activeKey = key
      if (this.myChart) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(document.getElementById(this.widgetId + key.toString()))
      let YData = []
      let XData = []
      if (!this.styleConfig.barType) {
        if (!this.$attrs.is_components) {
          return
        }
      }
      const {
        barType, legend, barWidth,
        barItemStyle: { color, ...otherItemStyle }
      } = this.styleConfig
      if (Object.keys(this.dataSource).length) {
        YData = []
        XData = []
        const tempObj = {}
        const tempData = _.cloneDeep(this.dataSource)
        tempData[this.columns[key]] = tempData[this.columns[key]].slice(0, this.$attrs.is_components ? 15 : 8)
        tempData[this.columns[key]].forEach((e) => {
          const name = e.originSiteName + '-' + e.peerSiteName
          const unit = e.unit
          delete e.originSiteName
          delete e.peerSiteName
          delete e.unit
          YData.push(name)
          Object.keys(e).forEach((k) => {
            const ks = k + '(' + unit + ')'
            if (!(ks in tempObj)) {
              tempObj[ks] = []
            }
            tempObj[ks].push(e[k])
          })
        })
        Object.keys(tempObj).forEach(key => {
          XData.push({
            name: key,
            type: 'bar',
            label: {
              show: true,
              formatter: function (params) {
                if (params.value > 0) {
                  return params.value
                } else {
                  return ''
                }
              }
            },
            data: tempObj[key]
          })
        })
      }
      XData.forEach(x => {
        x = Object.assign(x, {
          barWidth: barWidth,
          itemStyle: otherItemStyle,
          stack: barType === 'single'
        })
      })
      let x = { show: false }
      if (this.styleConfig.xAxis) {
        x = this.styleConfig.xAxis
      }
      let y = { show: false, data: YData }
      if (this.styleConfig.yAxis) {
        y = Object.assign(y, this.styleConfig.yAxis)
      }
      if (this.styleConfig.reverse) {
        x = Object.assign(x, { type: 'value' })
      } else {
        y = Object.assign(y, { type: 'value' })
      }
      const option = {
        color,
        tooltip: {
          // trigger: 'axis',
          // axisPointer: {
          //   // Use axis to trigger tooltip
          //   type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          // }
          show: false
        },
        legend,
        grid: this.grid,
        xAxis: x,
        yAxis: y,
        series: XData
      }
      this.myChart.setOption(option)
      this.$nextTick(() => {
        this.myChart.resize()
      })
    },
    getId () {
      if (!this.widgetId) {
        this.widgetId = uuid()
      }
      return this.widgetId
    }
  },
  mounted () {
    this.reloadEcharts(0)
    // this.$EventBus.$on('merge', () => this.reloadEcharts(this.activeKey))
  }
}
</script>

<style scoped>

</style>
