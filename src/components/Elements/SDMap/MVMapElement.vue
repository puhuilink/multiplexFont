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
    <div :style="{ZIndex: 1, color: 'white', position: 'absolute', right: '20px', top: '30px', width: '100px',height: '80px'}">
      <a-button :block="true" size="large" ghost @click="returnToDefault">恢复默认</a-button>
    </div>
    <a-drawer
      :title="'该城市共有'+siteList.length+'个站点'"
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
        :data-source="siteList"
        style="cursor: pointer"
      >
        <a-list-item slot="renderItem" slot-scope="item" @click="changeSite(item)" :style="listColor(item)">
          <a slot="actions"><a-icon type="right" /></a>
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
import { defaultOption } from '~~~/Elements/SDMap/MapData'
import { sql } from '@/utils/request'
import { dealQuery } from '@/utils/util'
import { MVSiteService } from '@/api/service/SdwanSiteService'
import NewAlarmElement from '~~~/Elements/NewAlarmElement'

export default {
  name: 'MvMapElement',
  components: { NewAlarmElement },
  data () {
    return {
      chartConfig: undefined,
      visible: false,
      myChart: null,
      width: 920,
      height: 630,
      loading: false,
      cityInfo: new Map(),
      cityCount: new Map(),
      preData: [],
      errorData: [],
      siteList: [],
      lastPoint: {},
      errorDetails: [],
      modalVisible: false,
      levelMap: {
        critical: 1,
        major: 2,
        normal: 3
      },
      api: 'mv',
      alert: []
    }
  },
  watch: {
  },
  methods: {
    async changeSite (item) {
      const real = {
        label: item.name,
        value: item.id
      }
      Object.assign(this.lastPoint, { id: item.id, name: item.name })
      console.log(real)
      this.$emit('selectChange', real)
      this.openModal()
      const { data } = await MVSiteService.getErrorById({ siteId: item.id })
      this.errorData = data.exception
      this.alert = data.alert ? data.alert : []
      if (!this.alert.length) {
        this.$message.warn('该站点无告警信息')
        this.closeModal()
      }
      await this.getSiteRelation(item.id)
      this.visible = false
      this.loading = false
      this.draw()
    },
    listColor (item) {
      let flag = false
      this.errorData.forEach((entity) => {
        if (item.id === entity.originSiteId || item.id === entity.peerSiteId) {
          flag = true
        }
      })
      const color = flag ? { color: 'red' } : {}
      return { ...color }
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
    closeModal () {
      this.modalVisible = false
      this.visible = false
    },
    openModal () {
      this.modalVisible = true
      this.loading = true
    },
    async returnToDefault () {
      await this.getDefaultRelation()
      const { data } = await MVSiteService.getAllError()
      this.errorData = data
      this.draw()
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
        const city = params.data.city
        Object.assign(that.lastPoint, { city })
        that.getCitySite(city).then(info => {
          that.data = info
          that.loading = false
        })
      })
      this.myChart.on('click', 'series.lines', function (params) {
        const details = []
        const { toName, fromName } = params.data
        that.errorData.forEach((ed) => {
          const { originCity, peerCity, originSiteName, peerName, alarmDetail } = ed
          if ((toName === originCity && fromName === peerCity) || (toName === peerCity && fromName === originCity)) {
            details.push(
              {
                originSiteName,
                peerName,
                alarmDetail
              }
            )
          }
          that.showModal = !!details.length
          that.errorDetails = details
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
    tranDataToConfig () {
      const nodes = new Set()
      this.preData.forEach((record) => {
        nodes.add(record.city)
        nodes.add(record.target_city)
      })
      const node = []
      const temp = this.cityInfo
      nodes.forEach(el => {
        node.push({
          name: el.split('/')[0] + '(' + this.cityCount.get(el) + ')',
          city: el,
          value: [...temp.get(el), 2],
          symbolSize: 20,
          itemStyle: {
            'normal': {
              color: {
                type: 'linear ', // linear 线性渐变  radial径向渐变
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(35,200,155, 1)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(35,200,155, 1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              opacity: 0.7
            }
          }
        })
      })
      this.chartConfig.series[0].data = node
    },
    linkDataToConfig () {
      const moveLine = []
      const temp = this.cityInfo
      this.preData.forEach((record) => {
        moveLine.push({
          fromName: record.city,
          toName: record.target_city,
          coords: [temp.get(record.city), temp.get(record.target_city)]
        })
      })
      this.chartConfig.series[2].data = moveLine
    },
    transformError () {
      const nodes = new Set()
      const moveLine = []
      const temp = this.cityInfo
      this.errorData.forEach((record) => {
        nodes.add(record.originCity)
        nodes.add(record.peerCity)
        moveLine.push({
          fromName: record.originCity,
          toName: record.peerCity,
          coords: [temp.get(record.originCity), temp.get(record.peerCity)],
          lineStyle: {
            normal: {
              color: '#ff4949',
              width: 5,
              opacity: 0.7,
              curveness: 0.5
            }
          },
          tooltip: {
            show: true,
            formatter: () => record.alarmDetail,
            position: ['50%', '50%'],
            trigger: 'item',
            triggerOn: 'click',
            borderColor: '#333'
          }
        })
      })
      const node = []
      nodes.forEach(el => {
        node.push({
          name: el.split('/')[0] + '(' + this.cityCount.get(el) + ')',
          city: el,
          value: [...temp.get(el), 2],
          symbolSize: 20,
          itemStyle: {
            'normal': {
              color: '#ff4949',
              opacity: 0.7
            }
          }
        })
      })
      const nodeData = this.chartConfig.series[0].data
      const lineData = this.chartConfig.series[2].data
      this.chartConfig.series[0].data = [...nodeData, ...node]
      this.chartConfig.series[2].data = [...lineData, ...moveLine]
    },
    draw () {
      this.chartConfig = this.chartConfig ? this.chartConfig : defaultOption
      this.tranDataToConfig()
      this.linkDataToConfig()
      this.transformError()
      this.reloadEcharts(this.chartConfig)
    },
    async getCityInfo () {
      const str = 'select distinct v.city,lat,lng,count from v_mv_map v left join (select city,count(1) as count from v_mv_map group by city) s on v.city=s.city'
      const cityMap = new Map()
      const cityCount = new Map()
      const result = dealQuery(await sql(str))
      result.forEach((entity) => {
        cityMap.set(entity.city, [Number(entity.lng), Number(entity.lat)])
        cityCount.set(entity.city, Number(entity.count))
      })
      this.cityInfo = cityMap
      this.cityCount = cityCount
    },
    async getCitySite (city) {
      const str = `select id,name from v_mv_map where city = '${city}'`
      this.siteList = dealQuery(await sql(str))
    },
    async getDefaultRelation () {
      // bb6b973a6e08400794af6404e8285f14 BJ1
      // 229ccba1e5e2420287d4fd4513d02eb0 BJ2
      // 85dbcf11e50d44e6ae470a72a4affbe6 XM1
      // febe32928230414ba989eadcaba496b5 XM2
      const str = 'select * from v_mv_relation_info where id in (\'bb6b973a6e08400794af6404e8285f14\',\n' +
        '\'229ccba1e5e2420287d4fd4513d02eb0\',\n' +
        '\'85dbcf11e50d44e6ae470a72a4affbe6\',\n' +
        '\'febe32928230414ba989eadcaba496b5\')'
      this.preData = dealQuery(await sql(str))
    },
    async getSiteRelation (id) {
      const str = `select * from v_mv_relation_info where id = '${id}'`
      this.preData = dealQuery(await sql(str))
    }
  },
  async mounted () {
    await this.getCityInfo()
    await this.returnToDefault()
  }
}
</script>

<style scoped>

</style>
