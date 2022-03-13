<template>
  <div
    :style="{
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '2px',
      textAlign: 'center',
    }"
  >
    <div :id="getId()" :style="{ width: width+'px', height: height+'px' }"></div>
    <a-drawer
      :title="'该城市共有'+data.length+'个站点'"
      placement="right"
      :closable="false"
      :visible="visible"
      :get-container="false"
      :wrap-style="{ position: 'absolute' }"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <a-list
        class="demo-loadmore-list"
        :loading="loading"
        item-layout="horizontal"
        :data-source="data"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a slot="actions"><a-icon type="right" @click="globalChange(item)" /></a>
          <div>{{ item.name }}</div>
        </a-list-item>
      </a-list>
    </a-drawer>
  </div>
</template>

<script>

import echarts from 'echarts'
import uuid from 'uuid/v4'
import _ from 'lodash'
import { SdwanSiteService } from '@/api'

export default {
  name: 'SDMapElement',
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
      data: [
        { name: { last: 1 } }
      ]
    }
  },
  watch: {
    'elementProps': {
      immediate: true,
      deep: true,
      handler (value) {
        if (value) {
          if (value.series) {
            if (!this.dataSource.length) {
              return
            }
            this.reloadEcharts(this.drawLine(this.dataSource, _.cloneDeep(value)))
          }
        }
      }
    }
  },
  methods: {
    globalChange (value) {
      const real = {
        label: value.name,
        value: value.id
      }
      this.$emit('selectChange', real)
      this.visible = false
    },
    afterVisibleChange (val) {
      console.log('visible', val)
    },
    showDrawer () {
      this.visible = true
      this.loading = true
    },
    onClose () {
      this.visible = false
    },
    drawLine: function (data, option) {
      const allData = {}
      const node = []
      const moveLine = []
      const citys = []
      const cs = {}
      data.forEach(d => {
        cs[d.ocity] = { name: d.ocity, lat: d.olat, lng: d.olng }
        cs[d.pcity] = { name: d.pcity, lat: d.plat, lng: d.plng }
        moveLine.push({
          fromName: d.ocity,
          toName: d.pcity,
          coords: [[Number(d.olng), Number(d.olat)], [Number(d.plng), Number(d.plat)]]
        })
      })
      Object.values(cs).forEach(el => {
        const { name, lat, lng } = el
        node.push({
          name: name.split('/')[0],
          city: name,
          value: [Number(lng), Number(lat), 2],
          symbolSize: 10,
          itemStyle: {
            'normal': {
              color: new echarts.graphic.RadialGradient(
                0.5, 0.5, 0.5,
                [
                  { offset: 0.5, color: '#ffbf31' },
                  { offset: 1, color: 'transparent' }
                ]
              )
            }
          }
        })
      })
      Object.assign(allData, { 'city': node })
      option.series[0].data = node
      option.series[1].data = citys
      option.series[2].data = moveLine
      return option
    },
    async reloadEcharts (option) {
      await this.$nextTick()
      if (this.myChart) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(document.getElementById(this.widgetId))
      this.myChart.setOption(option)
      const that = this
      this.myChart.on('click', 'series.effectScatter', function (params) {
        that.showDrawer()
        SdwanSiteService.getSiteList(params.data.city).then(info => {
          that.data = info
          that.loading = false
        })
      })
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
    async getNodeData () {
      this.dataSource = await SdwanSiteService.getCityConnection()
      await this.reloadEcharts(this.drawLine(this.dataSource, this.elementProps))
    }
  },
  mounted () {
    this.getNodeData()
  }
}
</script>

<style scoped>

</style>
