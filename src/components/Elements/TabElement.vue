<template>

  <a-tabs type="card" :style="{ width: '100%'}" @change="reloadEcharts" size="large">
    <a-tab-pane v-for="(e,index) in columns" :key="index" :tab="e">
      <div :id="getId()+index.toString()" :style="{ width: width+'px', height: height+'px' }" ></div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
// import MoreProprietaryConfig from '@/model/config/proprietaryConfigs/MoreProprietaryConfig'

import _ from 'lodash'
import echarts from 'echarts'
import uuid from 'uuid/v4'
export default {
  name: 'TabElement',
  data () {
    return {
      // styleConfig: new MoreProprietaryConfig({}),
      elementProps: {
        styleConfig: {
        }
      },
      styleConfig: {
      },
      fatherStyle: {},
      columns: [{ title: '空' }],
      dataSource: [],
      visible: false,
      myChart: null,
      activeKey: 0,
      width: 100,
      height: 100,
      widgetId: null,
      grid: null
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
            this.columns = [{ title: 'text' }]
          } else {
            this.columns = value
          }
        } else {
          this.columns = [{ title: 'text' }]
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
    }
  },
  methods: {
    async reloadEcharts (key) {
      await this.$nextTick()
      this.activeKey = key
      if (this.myChart) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(document.getElementById(this.widgetId + key.toString()))
      let YData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      let XData = [
        {
          name: 'Direct',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          data: [320, 302, 301, 334, 390, 330, 320]
        }
      ]
      if (!this.styleConfig.barType) {
        return
      }
      const {
        barType, legend, barWidth,
        barItemStyle: { color, ...otherItemStyle }
      } = this.styleConfig
      if (Object.keys(this.dataSource).length) {
        YData = []
        XData = []
        const tempObj = {}
        this.dataSource[this.columns[key]].forEach((e) => {
          const name = e.originSiteName + '-' + e.peerSiteName
          delete e.originSiteName
          delete e.peerSiteName
          delete e.unit
          YData.push(name)
          Object.keys(e).forEach((k) => {
            if (!(k in tempObj)) {
              tempObj[k] = []
            }
            tempObj[k].push(e[k])
          })
        })
        Object.keys(tempObj).forEach(key => {
          XData.push({
            name: key,
            type: 'bar',
            label: {
              show: true
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
