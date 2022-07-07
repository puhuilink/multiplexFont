<template>
  <div
    :style="{
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '0',
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
      <a-button @click="getNodeData">默认</a-button>
      <a-list
        class="demo-loadmore-list"
        :loading="loading"
        item-layout="horizontal"
        :data-source="data"
      >
        <a-list-item slot="renderItem" slot-scope="item,index" @click="globalChange(item)" :style="{...listColor(index),cursor:'pointer'}">
          <div>{{ item.name }}</div>
        </a-list-item>
      </a-list>
    </a-drawer>
    <a-modal
      width="80%"
      centered
      :visible="modalVisible"
      @ok="closeModal"
      @cancel="closeModal"
      @close="closeModal"
      style="display: flex;align-items: center;justify-content: center;"
    >
      <NewAlarmElement
        style="width: 100%;height: 580px;padding-top:30px;padding-bottom:0px"
        :loading="loading"
        :show.sync="modalVisible"
        :is-components="true"
        :props-data="alert"
        :api-type="api"
      />
    </a-modal>
  </div>
</template>

<script>

import echarts from 'echarts'
import uuid from 'uuid/v4'
import _ from 'lodash'
import { SdwanSiteService } from '@/api'
import NewAlarmElement from '@/components/Elements/NewAlarmElement'

export default {
  name: 'SDMapElement',
  components: { NewAlarmElement },
  data () {
    return {
      elementProps: {
        styleConfig: {}
      },
      api: 'sdwan',
      styleConfig: {},
      fatherStyle: {},
      columns: ['空'],
      dataSource: [],
      modalDataSource: [],
      visible: false,
      modalVisible: false,
      myChart: null,
      width: 880,
      height: 630,
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
      lastPoint: {},
      alert: [],
      levelMap: {
        critical: 1,
        major: 2,
        normal: 3
      }
    }
  },
  watch: {
    'elementProps': {
      immediate: true,
      deep: true,
      async handler (value) {
        if (value) {
          if (value.series) {
            if (!this.dataSource.length) {
              return
            }
            const op = await this.drawAll(this.dataSource, _.cloneDeep(value))
            await this.reloadEcharts(op)
          }
        }
      }
    }
  },
  methods: {
    closeModal () {
      this.modalVisible = false
      this.visible = false
    },
    openModal () {
      this.modalVisible = true
      this.loading = true
    },
    async globalChange (value) {
      const real = {
        label: value.name,
        value: value.id
      }
      Object.assign(this.lastPoint, real)
      this.$emit('selectChange', real)
      this.visible = false
      this.openModal()
      this.dataSource = await SdwanSiteService.getCityConnection(value.id)
      await this.getExceptions(true)
      this.site = value.name
      await this.reloadEcharts(_.cloneDeep(this.drawLine(this.dataSource, this.elementProps, this.dataIndex)))
      await this.$nextTick()
    },
    afterVisibleChange (val) {
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
          fromName: this.lastPoint.city,
          toName: city.split('/')[0],
          coords: [[Number(this.lng), Number(this.lat)], [Number(lng), Number(lat)]]
        })
      })
      const option = _.cloneDeep(op)
      if (this.errorNodes.includes(this.lastPoint.city)) {
        option.series[0].data[index].itemStyle = {
          'normal': {
            color: new echarts.graphic.RadialGradient(
              0.5, 0.5, 0.5,
              [
                { offset: 0.3, color: 'rgba(255,0,0,1)' },
                { offset: 1, color: 'rgba(255,0,0,0.3)' }
              ]
            )
          }
        }
      } else if (this.warnNodes.includes(this.lastPoint.city)) {
        option.series[0].data[index].itemStyle = {
          'normal': {
            color: new echarts.graphic.RadialGradient(
              0.5, 0.5, 0.5,
              [
                { offset: 0.3, color: 'rgba(255,200,0,1)' },
                { offset: 1, color: 'rgba(255,200,0,0.7)' }
              ]
            )
          }
        }
      } else if (this.normalNodes.includes(this.lastPoint.city)) {
        option.series[0].data[index].itemStyle = {
          'normal': {
            color: new echarts.graphic.RadialGradient(
              0.5, 0.5, 0.5,
              [
                { offset: 0.3, color: 'rgba(0,255,200,1)' },
                { offset: 1, color: 'rgba(0,255,200,0.3)' }
              ]
            )
          }
        }
      } else {
        option.series[0].data[index].itemStyle = {
          'normal': {
            color: new echarts.graphic.RadialGradient(
              0.5, 0.5, 0.5,
              [
                { offset: 0.3, color: 'rgba(10,215,125,1)' },
                { offset: 1, color: 'rgba(100,165,225,1)' }
              ]
            )
          }
        }
      }
      const warningLines = this.getWarningLines(moveLine)
      option.series[2].data = moveLine
      option.series[3].data = warningLines[0]
      option.series[4].data = warningLines[1]
      option.series[5].data = warningLines[2]
      return option
    },
    initMoveLines () {
      const moveLine = []
      const center = [
        {
          id: '5ea7c500bd20c06533e6278b',
          name: '北京',
          lat: 39.938884,
          lng: 116.397459
        },
        {
          id: '5eaab7aebd20c06533e62984',
          name: '厦门',
          lat: 24.4854066051763,
          lng: 118.096435499767
        },
        {
          id: '5ee222c90ab5d602ce18098a',
          name: '北京',
          lat: 39.938884,
          lng: 116.397459
        },
        {
          id: '5ef07a9f4904421679b743d3',
          name: '厦门',
          lat: 24.4854066051763,
          lng: 118.096435499767
        }
      ]
      center.forEach(async c => {
        const arr = await SdwanSiteService.getCityConnection(c.id)
        arr.forEach(d => {
          const { city, lat, lng } = d
          moveLine.push({
            fromName: c.name,
            toName: city.split('/')[0],
            coords: [[Number(c.lng), Number(c.lat)], [Number(lng), Number(lat)]]
          })
        })
      })
      this.moveLines = moveLine
    },
    getWarningLines (lines) {
      if (!this.errorCitys.length && !this.warnCitys.length && !this.normalCitys.length) {
        return []
      }
      if (!lines.length) {
        return []
      }
      const arr = [[], [], []]
      lines.forEach(line => {
        const { fromName, toName } = line
        let error = false
        let warning = false
        let normal = false
        this.errorCitys.forEach(ec => {
          if (ec.includes(fromName)) {
            if (ec.includes(toName)) {
              error = true
            }
          }
        })
        this.warnCitys.forEach(ec => {
          if (ec.includes(fromName)) {
            if (ec.includes(toName)) {
              warning = true
            }
          }
        })
        this.normalCitys.forEach(ec => {
          if (ec.includes(fromName)) {
            if (ec.includes(toName)) {
              normal = true
            }
          }
        })
        if (error) {
          arr[0].push(line)
        }
        if (warning) {
          arr[1].push(line)
        }
        if (normal) {
          arr[2].push(line)
        }
      })
      return arr
    },
    drawAll (data, option) {
      const node = []
      this.city.forEach(el => {
        const { city, lat, lng, total } = el
        node.push({
          name: city.split('/')[0] + '(' + total + ')',
          city: city,
          value: [Number(lng), Number(lat), 2],
          symbolSize: 10,
          itemStyle: {
            'normal': {
              color: {
                type: 'linear ', // linear 线性渐变  radial径向渐变
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(0,255,255,0.3)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(10,215,125,1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              opacity: 0.7
            }
          }
        })
      })
      const warningLines = this.getWarningLines(this.moveLines)
      option.series[0].data = node
      option.series[1].data = []
      option.series[2].data = _.cloneDeep(this.moveLines)
      option.series[3].data = warningLines[0] || []
      option.series[4].data = warningLines[1] || []
      option.series[5].data = warningLines[2] || []
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
    },
    async getExceptions (flag = false) {
      let exception
      this.errorIds = {}
      this.errorCitys = []
      if (flag) {
        const ex = await SdwanSiteService.getErrorConnection({ siteId: this.lastPoint.value })
        exception = ex.data.exception
        this.alert = ex.data.alert ? ex.data.alert.map(a => ({
          alarm_type: a.type,
          alarm_level: this.levelMap[a.level],
          detail: a.details,
          target: a.targetType,
          status: a.status
        })) : []
        this.loading = false
      } else {
        const d = await SdwanSiteService.getAlert({ type: 'day' })
        exception = d.data.exception
      }
      if (!exception) {
        this.$message.warn('未查询到告警信息！')
        this.closeModal()
        return
      }
      this.errorIds = {}
      this.errorNodes = []
      this.errorCitys = [] // 城市
      this.warnIds = {}
      this.warnNodes = []
      this.warnCitys = [] // 城市
      this.normalIds = {}
      this.normalNodes = []
      this.normalCitys = [] // 城市
      if (exception && exception.length) {
        exception.forEach(e => {
          const { originSiteId, originCity,
            peerSiteId, peerCity, level } = e
          if (!originCity || !peerCity) {
            return
          }
          if (level === 'critical') {
            this.errorCitys.push(originCity.split('/')[0] + '-' + peerCity.split('/')[0])
            if (originCity === peerCity) {
              this.errorNodes.push(originCity.split('/')[0])
            }
            if (originSiteId.toString() in this.errorIds) {
              this.errorIds[originSiteId.toString()].push(peerSiteId.toString())
            } else {
              this.errorIds[originSiteId.toString()] = [peerSiteId.toString()]
            }
            if (peerSiteId.toString() in this.errorIds) {
              this.errorIds[peerSiteId.toString()].push(originSiteId.toString())
            } else {
              this.errorIds[peerSiteId.toString()] = [originSiteId.toString()]
            }
          } else if (level === 'major') {
            this.warnCitys.push(originCity.split('/')[0] + '-' + peerCity.split('/')[0])
            if (originCity === peerCity) {
              this.warnNodes.push(originCity.split('/')[0])
            }
            if (originSiteId.toString() in this.warnIds) {
              this.warnIds[originSiteId.toString()].push(peerSiteId.toString())
            } else {
              this.warnIds[originSiteId.toString()] = [peerSiteId.toString()]
            }
            if (peerSiteId.toString() in this.warnIds) {
              this.warnIds[peerSiteId.toString()].push(originSiteId.toString())
            } else {
              this.warnIds[peerSiteId.toString()] = [originSiteId.toString()]
            }
          } else {
            this.normalCitys.push(originCity.split('/')[0] + '-' + peerCity.split('/')[0])
            if (originCity === peerCity) {
              this.normalNodes.push(originCity.split('/')[0])
            }
            if (originSiteId.toString() in this.normalIds) {
              this.normalIds[originSiteId.toString()].push(peerSiteId.toString())
            } else {
              this.normalIds[originSiteId.toString()] = [peerSiteId.toString()]
            }
            if (peerSiteId.toString() in this.normalIds) {
              this.normalIds[peerSiteId.toString()].push(originSiteId.toString())
            } else {
              this.normalIds[peerSiteId.toString()] = [originSiteId.toString()]
            }
          }
        })
      }
    },
    async getNodeData () {
      this.visible = false
      this.initMoveLines()
      this.lastPoint = {}
      this.city = await SdwanSiteService.getCityList()
      this.dataSource = await SdwanSiteService.getCityConnection()
      await this.getExceptions()
      const op = this.drawAll(this.dataSource, this.elementProps)
      await this.reloadEcharts(op)
      await this.$nextTick()
    },
    listColor (num) {
      const item = this.data[num]
      if (!item) {
        return {}
      } else if (!item.id) {
        return {}
      }
      if (this.lastPoint.value) {
        if (!this.errorIds[this.lastPoint.value.toString()] && !this.warnIds[this.lastPoint.value.toString()] && !this.normalIds[this.lastPoint.value.toString()]) {
          return {
            color: 'green'
          }
        }
        if (this.errorIds[this.lastPoint.value.toString()] && this.errorIds[this.lastPoint.value.toString()].includes(item.id.toString())) {
          // 上次有点击过站点
          return {
            color: 'red'
          }
        } else if (this.warnIds[this.lastPoint.value.toString()] && this.warnIds[this.lastPoint.value.toString()].includes(item.id.toString())) {
          return {
            color: '#ffdb00'
          }
        } else if (this.normalIds[this.lastPoint.value.toString()] && this.normalIds[this.lastPoint.value.toString()].includes(item.id.toString())) {
          return {
            color: '#2d97ff'
          }
        } else {
          return {
            color: 'green'
          }
        }
      } else {
        if (item.id.toString() in this.errorIds) {
          return {
            color: 'red'
          }
        } else if (item.id.toString() in this.warnIds) {
          return {
            color: '#ffdb00'
          }
        } else if (item.id.toString() in this.normalIds) {
          return {
            color: '#2d97ff'
          }
        } else {
          return {
            color: 'green'
          }
        }
      }
    }
  },
  mounted () {
    this.getNodeData()
  }
}
</script>

<style scoped>

</style>
