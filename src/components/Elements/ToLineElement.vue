<template>
  <div
  >
    <div :style="selectStyle" v-if="visible">
      To:
      <a-select
        :style="{width: selectWidth+'px'}"
        show-search
        :value="selectedValue"
        @change="handleChange"
      >
        <a-select-option :key="index" :value="item.id" v-for="(item,index) in selectData" :style="{width: selectWidth+'px'}">{{ item.name }}</a-select-option>
      </a-select>
    </div>
    <div :id="getId()" :style="{ width: width+'px', height: height+'px',marginTop: mgt+'px',zIndex: -1, position: 'absolute' }"></div>
  </div>
</template>

<script>

import echarts from 'echarts'
import uuid from 'uuid/v4'
import _ from 'lodash'
import { dealQuery } from '@/utils/util'
import { sql } from '@/utils/request'
import { MVSiteService } from '@/api/service/SdwanSiteService'

export default {
  name: 'ToLineElement',
  data () {
    return {
      elementProps: undefined,
      styleConfig: {},
      dataOption: {},
      selectData: [{ name: '我莫', id: 123 }],
      selectedValue: '',
      visible: true,
      myChart: null,
      width: 880,
      height: 600,
      mgt: 0,
      loading: false,
      city: [],
      data: [
        { name: { last: 1 } }
      ],
      dataIndex: 0,
      chartConfig: null,
      selectStyle: {
        display: 'block',
        position: 'absolute',
        right: '100px',
        bottom: '500px',
        fontSize: '30px',
        color: 'white',
        zIndex: 1
      },
      selectWidth: 100,
      siteTrafficConfig: undefined
    }
  },
  watch: {
    'elementProps': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          this.dataOption = value.data.option ? value.data.option : {}
          this.chartConfig = this.initOption()
          if (value.data && value.data.siteTrafficConfig) {
            this.selectedValue = value.data.siteTrafficConfig.peerId
          }
          this.reloadEcharts()
        }
      }
    },
    'elementProps.selectOptions': {
      immediate: true,
      deep: true,
      async handler (value) {
        if (value) {
          const { show, sqlString } = value
          if (show && sqlString) {
            this.selectData = sqlString === 'api' ? (await MVSiteService.getRelationSiteById({ siteId: this.elementProps.data.siteTrafficConfig.siteId })).data : dealQuery(await sql(sqlString))
          }
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
          this.selectStyle.bottom = value.height * 0.9 + 'px'
          this.selectStyle.right = value.width * 0.2 + 'px'
          this.selectWidth = (this.width / 4) >= 150 ? 150 : this.width / 4
          this.reloadEcharts()
        }
      }
    }
  },
  methods: {
    async handleChange (value) {
      this.selectedValue = value
      this.siteTrafficConfig.peerId = value
      await this.getSiteTrafficOption(this.siteTrafficConfig.requestType)
      await this.getSiteTrafficOption(this.siteTrafficConfig.requestType)
      this.chartConfig = _.cloneDeep(this.initOption())
      await this.reloadEcharts()
    },
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
    async getSiteTrafficOption (type) {
      switch (type) {
        case 'wan':
          await this.generateWanData()
          break
        case 'delay':
          await this.generateDelayData()
          break
        case 'netDelay':
          await this.generateDelayData()
          break
        case 'packet':
          await this.generatePacketData()
          break
        default:
          await this.generateWanData()
      }
    },
    getSubMultiple (unit, units) {
      if (!unit || !units) {
        return 1
      }
      // console.log(this.unitMapping(units) / this.unitMapping(unit))
      return this.unitMapping(units) / this.unitMapping(unit)
    },
    unitMapping (key) {
      if (!key) {
        return 1
      }
      const mapping = {
        bps: 1,
        Kbps: 1024,
        Mbps: 1024 * 1024,
        Gbps: 1024 * 1024 * 1024
      }
      if (key in mapping) {
        return mapping[key]
      } else {
        return 1
      }
    },

    async generateWanData () {
      const { data: { throughput } } = await this.siteTrafficConfig.requestData()
      if (!throughput) {
        return
      }
      const subMultiple = this.getSubMultiple(this.siteTrafficConfig.unit, throughput[0].unit)
      const numberUnit = this.siteTrafficConfig.unit ? this.siteTrafficConfig.unit : throughput[0].unit
      const option = {
        legend: {
          data: throughput ? [Object.keys(throughput[0])[0] + '(' + numberUnit + ')', Object.keys(throughput[0])[1] + '(' + numberUnit + ')'] : []
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: throughput ? _.uniq(
            throughput.map(({ time }) => time)
          ) : []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: Object.keys(throughput[0])[0] + '(' + numberUnit + ')',
          data: throughput.map(({ rx }) => (rx * subMultiple).toFixed(2))
        }, {
          name: Object.keys(throughput[0])[1] + '(' + numberUnit + ')',
          data: throughput.map(({ tx }) => (tx * subMultiple).toFixed(2))
        }
        ]
      }
      Object.assign(this, { dataOption: option })
    },
    async generateDelayData () {
      const { data: { loss } } = await this.siteTrafficConfig.requestData()
      if (!loss) {
        this.dataOption.series = []
        return
      }
      const option = {
        legend: {
          data: ['loss', 'latency']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: loss ? _.uniq(
            loss.map(({ time }) => time)
          ) : []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'loss',
          data: loss.map(({ loss }) => loss.toFixed(2))
        }, {
          name: 'latency',
          data: loss.map(({ latency }) => latency.toFixed(2))
        }
        ]
      }
      Object.assign(this, { dataOption: _.cloneDeep(option) })
    },
    async generatePacketData () {
      const { data: { packet } } = await this.siteTrafficConfig.requestData()
      if (!packet) {
        return
      }
      const option = {
        legend: {
          data: ['rxPacket', 'txPacket']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: packet ? _.uniq(
            packet.map(({ time }) => time)
          ) : []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'rxPacket',
          data: packet.map(({ rxPacket }) => rxPacket.toFixed(2))
        }, {
          name: 'txPacket',
          data: packet.map(({ txPacket }) => txPacket.toFixed(2))
        }
        ]
      }
      Object.assign(this, { dataOption: option })
    },

    async getSiteCpeOption () {
      const { data: { cpu, mem } } = await this.siteCpeConfig.fetch()
      if (!cpu || !mem) {
        return
      }
      const option = {
        legend: {
          data: ['cpu利用率(%)', '内存利用率(%)']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: _.uniq(
            cpu.map(({ time }) => time)
          )
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'cpu利用率(%)',
          data: cpu.map(({ usage }) => usage.toFixed(2))
        }, {
          name: '内存利用率(%)',
          data: mem.map(({ usage }) => usage.toFixed(2))
        }
        ]
      }
      Object.assign(this, { dataOption: option })
    },
    initOption () {
      if (!this.elementProps.legend) {
        return {}
      }
      const { legend, xAxis, yAxis, decimalPoint, testLint: { type, width }, itemStyle: { color }, selectOptions, data, common, ...options } = this.elementProps
      this.siteTrafficConfig = this.siteTrafficConfig ? this.siteTrafficConfig : _.cloneDeep(data.siteTrafficConfig)
      this.siteTrafficConfig.peerId = this.selectedValue
      const { grid } = this.gridConfig(this.elementProps.common)
      const option = { grid, legend, xAxis: [xAxis], yAxis: [yAxis] }
      const line = (index) => ({
        type: 'line',
        itemStyle: {
          color: Array.isArray(color) ? color[index] : color
        },
        lineStyle: {
          type,
          width
        },
        ...options
      })
      let series = []
      if (this.dataOption.series) {
        series = this.dataOption.series.map((item, index) => ({ ...item, ...line(index) }))
        Object.assign(option, {
          tooltip: { 'trigger': 'axis', 'axisPointer': { 'type': 'shadow' }, 'position': { '_custom': { 'type': 'function', 'display': '<span>f</span> autoTooltipPosition(point, params, dom, rect, size)', '_reviveId': 5 } } },
          legend: Object.assign(legend, this.dataOption.legend),
          xAxis: Object.assign(xAxis, this.dataOption.xAxis),
          yAxis: Object.assign(yAxis, this.dataOption.yAxis),
          series
        })
      }
      return option
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
