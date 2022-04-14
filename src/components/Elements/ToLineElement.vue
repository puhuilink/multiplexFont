<template>
  <div
    :style="{
      display: 'flex'
    }"
  >
    <div :style="selectStyle">
      To:
      <a-select>
        <a-select-option :key="1">111</a-select-option>
      </a-select>
    </div>
    <div :id="getId()" :style="{ width: width+'px', height: height+'px' }"></div>
  </div>
</template>

<script>

import echarts from 'echarts'
import uuid from 'uuid/v4'
import _ from 'lodash'
import { SdwanSiteService } from '@/api'

export default {
  name: 'ToLineElement',
  data () {
    return {
      elementProps: {
        styleConfig: {}
      },
      styleConfig: {},
      fatherStyle: {},
      columns: ['空'],
      dataSource: [],
      visible: false,
      myChart: null,
      width: 880,
      height: 600,
      loading: false,
      city: [],
      data: [
        { name: { last: 1 } }
      ],
      dataIndex: 0,
      lng: 0,
      lat: 0,
      site: '',
      chartConfig: null,
      selectStyle: {
        position: 'absolute',
        right: '100px',
        bottom: '500px',
        fontSize: '30px'
      }
    }
  },
  watch: {
    'elementProps': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.chartConfig = this.initOption()
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
          this.width = value.width
          this.height = value.height
          this.selectStyle.bottom = this.height * 0.8 + 'px'
          this.selectStyle.right = this.width * 0.2 + 'px'
          this.reloadEcharts()
        }
      }
    }
  },
  methods: {
    async reloadEcharts () {
      await this.$nextTick()
      if (this.myChart) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(document.getElementById(this.widgetId))
      if (this.chartConfig) {
        this.myChart.setOption(this.chartConfig)
      }
      this.$nextTick(() => {
        this.myChart.resize()
      })
    },
    getId () {
      if (!this.widgetId) {
        this.widgetId = uuid()
      }
      return this.widgetId
    },
    initOption () {
      const { legend, xAxis, yAxis, decimalPoint, testLint: { type, width }, itemStyle: { color }, ...options } = this.elementProps
      // const line = (index) => ({
      //   type: 'line',
      //   itemStyle: {
      //     color: Array.isArray(color) ? color[index] : color
      //   },
      //   lineStyle: {
      //     type,
      //     width
      //   },
      //   ...options
      // })
      const series = []
      const { grid } = this.gridConfig(this.elementProps.common)
      const option = { grid, legend, series, xAxis: [xAxis], yAxis: [yAxis] }
      return Object.assign({}, option, { series })
    },
    gridConfig (config) {
      return _.cloneDeep({
        grid: [
          {
            show: true,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'transparent',
            borderWidth: 0
          },
          {
            show: true,
            top: 30 + config.padding[0],
            right: 30 + config.padding[1],
            bottom: 30 + config.padding[2],
            left: 30 + config.padding[3],
            borderWidth: 0,
            backgroundColor: 'transparent'
          }
        ],
        backgroundColor: { backgroundColor: config.backgroundColor }
      })
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
