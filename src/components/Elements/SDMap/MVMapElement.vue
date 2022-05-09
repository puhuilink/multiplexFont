<template>
  <div
    :style="{
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '0',
      textAlign: 'center',
    }"
  >
    <div :id="getId()" :style="{ width: width+'px', height: height+'px', ZIndex: -1 }"></div>
    <div :style="{}">
      <a-button @click="getNodeData">恢复默认</a-button>
    </div>
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
        <a-list-item slot="renderItem" slot-scope="item,index" @click="changeSite(item)" :style="listColor(index)">
          <a slot="actions"><a-icon type="right" /></a>
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
  name: 'MvMapElement',
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
      width: 1920,
      height: 1080,
      loading: false,
      city: [],
      data: [
        { name: { last: 1 } }
      ],
      dataIndex: 0,
      lng: 0,
      lat: 0,
      site: '',
      errorIds: {},
      errorCitys: [],
      errorNodes: [],
      warnIds: {},
      warnCitys: [],
      warnNodes: [],
      normalIds: {},
      normalCitys: [],
      normalNodes: [],
      moveLines: [],
      lastPoint: {}
    }
  },
  watch: {
  },
  methods: {
    afterVisibleChange (val) {
    },
    showDrawer () {
      this.visible = true
      this.loading = true
    },
    onClose () {
      this.visible = false
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
              [{
                offset: 0, color: 'rgba(0,255,255,0.3)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(10,215,125,1)' // 100% 处的颜色
              }]
            )
          }
        }
        const { value } = params
        that.lng = value[0]
        that.lat = value[1]
        that.dataIndex = params.dataIndex
        that.showDrawer()
        const city = params.data.city.split('/')[0]
        Object.assign(that.lastPoint, { city })
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
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
