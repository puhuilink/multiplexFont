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
      city: [],
      data: [
        { name: { last: 1 } }
      ],
      dataIndex: 0,
      lng: 0,
      lat: 0,
      site: ''
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
            this.reloadEcharts(this.drawAll(this.dataSource, _.cloneDeep(value)))
          }
        }
      }
    }
  },
  methods: {
    async globalChange (value) {
      const real = {
        label: value.name,
        value: value.id
      }
      this.$emit('selectChange', real)
      this.visible = false
      this.dataSource = await SdwanSiteService.getCityConnection(value.id)
      this.site = value.name
      await this.reloadEcharts(_.cloneDeep(this.drawLine(this.dataSource, this.elementProps, this.dataIndex)))
      await this.$nextTick()
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
    drawLine (data, op, index) {
      const moveLine = []
      data.forEach(d => {
        const { city, lat, lng } = d
        moveLine.push({
          fromName: this.site,
          toName: city,
          coords: [[Number(this.lng), Number(this.lat)], [Number(lng), Number(lat)]]
        })
      })
      const option = _.cloneDeep(op)
      option.series[0].data[index].itemStyle = {
        'normal': {
          color: new echarts.graphic.RadialGradient(
            0.5, 0.5, 0.5,
            [
              { offset: 0.3, color: 'blue' },
              { offset: 1, color: 'transparent' }
            ]
          )
        }
      }
      option.series[2].data = moveLine
      return option
    },
    drawAll: function (data, option) {
      const node = []
      const moveLine = []
      data.forEach(d => {
        const { city, lat, lng } = d
        moveLine.push({
          fromName: '13.四公局',
          toName: city,
          coords: [[116.41, 39.91], [Number(lng), Number(lat)]]
        })
      })
      this.city.forEach(el => {
        const { city, lat, lng } = el
        node.push({
          name: city.split('/')[0],
          city: city,
          value: [Number(lng), Number(lat), 2],
          symbolSize: 10,
          itemStyle: {
            'normal': {
              color: new echarts.graphic.RadialGradient(
                0.5, 0.5, 0.5,
                [
                  { offset: 0.5, color: '#59b269' },
                  { offset: 1, color: 'transparent' }
                ]
              )
            }
          }
        })
      })
      option.series[0].data = node
      option.series[1].data = []
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
        option.series[0].data[that.dataIndex].itemStyle = {
          'normal': {
            color: new echarts.graphic.RadialGradient(
              0.5, 0.5, 0.5,
              [
                { offset: 0.5, color: '#59b269' },
                { offset: 1, color: 'transparent' }
              ]
            )
          }
        }
        const { value } = params
        that.lng = value[0]
        that.lat = value[1]
        that.dataIndex = params.dataIndex
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
      this.city = await SdwanSiteService.getCityList()
      this.dataSource = await SdwanSiteService.getCityConnection()
      await this.reloadEcharts(this.drawAll(this.dataSource, this.elementProps))
    }
  },
  mounted () {
    this.getNodeData()
  }
}
</script>

<style scoped>

</style>
