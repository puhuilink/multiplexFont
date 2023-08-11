<template>
  <a-modal
    centered
    :footer="null"
    :title="title"
    v-model="visible"
    :width="920"
    wrapClassName="TaskDetailSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
  >
    <a-spin :spinning="spinning">
      <!-- 基本信息 -->
      <div class="TaskDetailSchema__basicInfo">
        <a-row>
          <a-col :span="12">
            <span>计划名称：{{ basicInfo.alias }}</span>
          </a-col>
          <a-col :span="12">
            <span>任务单号：{{ basicInfo.id }}</span>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="6">
            <span>开始时间：{{ basicInfo.actualStartTime }}</span>
          </a-col>
          <a-col :span="6">
            <span>完成时间：{{ basicInfo.actualEndTime }}</span>
          </a-col>
          <a-col :span="6">
            <span v-if="basicInfo.executor!==null">
              执行人：{{ basicInfo.executor!=null ?
                basicInfo.executor !== basicInfo.executor.toString()?
                  basicInfo.executor.toString().replaceAll('\"','').replace('[','').replace(']',''):
                  JSON.parse(basicInfo.executor).executor:
                '' }}</span>
          </a-col>
          <a-col :span="6">
            <span v-if="basicInfo.status!==null">任务单状态：{{ statusMapping[basicInfo.status.toString()] }}</span>
          </a-col>
        </a-row>
      </div>

      <!-- 点位信息 -->
      <div class="TaskDetailSchema__pointsInfo">
        <a-tabs default-active-key="zoneId">
          <a-tab-pane v-for="{ zoneAlias, zoneId } in switchCardList" :key="zoneId" :tab="zoneAlias" @click="changeZone(zoneId)">
            <a-table bordered :columns="columns" :dataSource="dataSource" :scroll="scroll">
              <template #value="text, record">
                {{ valueMapping(record) }}
              </template>
              <template #imgs="imgs,record">
                <span v-if="record.tags.imgs.length > 0">
                  <viewer :images="record.tags.imgs">
                    <img
                      v-for="(src,index) in record.tags.imgs"
                      :src="src"
                      :key="index"
                      style="width: 50px;height: 50px"
                    >
                  </viewer>
                </span>
              </template>
              <template #remark="remark">
                {{ remark.remarks }}
              </template>
              <template #endpoint="endpoint,record">
                {{ record.endpointAlias&&endpoint!=='NULL'&&endpoint!==''?endpoint:'虚拟实体' }}
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { DELAY_MAPPING } from '../../../typing'
import moment from 'moment'
import _ from 'lodash'
import { xungeng } from '@/utils/request'

export default {
  name: 'TaskDetailSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    details: [],
    columns: Object.freeze([
      {
        title: '点位',
        dataIndex: 'checkpointAlias',
        width: 180,
        customRender: (text) => text || ''
      },
      {
        title: '柜位',
        dataIndex: 'container',
        width: 180,
        customRender: (text) => text || ''
      },
      {
        title: '设备名称',
        dataIndex: 'hostAlias',
        width: 180,
        customRender: (text) => text || ''
      },
      {
        title: 'IP地址',
        dataIndex: 'hostBelong',
        width: 180,
        customRender: (text) => text || ''
      },
      {
        title: '设备归属单位',
        dataIndex: 'hostApartment',
        width: 180,
        customRender: (text) => text || ''
      },
      {
        title: '监控实体',
        dataIndex: 'endpointAlias',
        width: 180,
        scopedSlots: { customRender: 'endpoint' }
      },
      {
        title: '检查项',
        dataIndex: 'metricAlias',
        width: 180,
        customRender: (text) => text || ''
      },
      {
        title: '值',
        dataIndex: 'value',
        width: 180,
        scopedSlots: { customRender: 'value' }
      },
      {
        title: '备注',
        dataIndex: 'tags',
        width: 180,
        scopedSlots: { customRender: 'remark' }
      },
      {
        title: '图片',
        width: 180,
        scopedSlots: { customRender: 'imgs' }
      },
      {
        title: '设备位置',
        dataIndex: 'devicePosition',
        width: 180,
        customRender: (text) => text || ''
      },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        width: 180,
        customRender: (text) => text || ''
      },
      {
        title: '品牌',
        dataIndex: 'deviceBrand',
        width: 180,
        customRender: (text) => text || ''
      },
      {
        title: 'SN号',
        width: 180,
        dataIndex: 'sn',
        customRender: (text) => text || ''
      }
    ]),
    dataSource: [],
    record: {},
    parentData: null,
    spinning: false,
    switchCardList: [],
    taskDetail: [],
    basicInfo: {
      id: '723',
      alias: '厦门数据中心 动环巡更计划',
      status: '10',
      planId: '1267708679575048194',
      executor: { executor: '' },
      actualStartTime: '2021-05-21 13:48:22',
      actualEndTime: '2021-05-21 14:02:03'
    },
    statusMapping: {
      '0': '未开始',
      '1': '进行中',
      '3': '超时完成',
      '10': '告警完成',
      '20': '无告警完成',
      '30': '已过期'
    }
  }),
  filters: {
    delay (delay) {
      return DELAY_MAPPING.get(delay)
    },
    time (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  computed: {
    pointsInfo () {
      return this.record.rfInfo || {}
    },
    scroll () {
      return {
        x: _.sum(this.columns.map((e) => e.width || 60)),
        y: 300
      }
    }
  },
  methods: {
    valueMapping (record) {
      const type = record.type
      const list = JSON.parse(record.format)
      const value = record.value
      if (type === 'fill') {
        return value
      }
      for (const obj of list) {
        if (obj.value.toString() === value.toString()) {
          return obj.alias
        }
      }
      return value
    },
    setPreview () {
      this.details.forEach(img => {
        img.src = img.header
        img.msrc = img.header
        img.alt = img.top_commentsName
        img.title = img.top_commentsName
        img.w = 200
        img.h = 200
      })
      return this.details
    },
    async fetch (record, taskId, zoneId) {
      try {
        this.spinning = true
        const v = await xungeng.post('/taskResultHistory/taskHistory', { taskId, ...zoneId ? { zoneId } : {} })
        if (v.code !== 200) {
          this.$message.error('请求失败')
          return
        }
        const resData = v.data
        this.basicInfo = { ...record }
        this.switchCardList = resData.zoneList
        this.dataSource = resData.history
      } catch (e) {
        this.taskDetail = []
        this.record = {}
        throw e
      } finally {
        this.spinning = false
      }
    },
    detail (record) {
      this.show('巡更记录单')
      this.parentData = record
      this.fetch(this.parentData, record.id)
    },

    switchCardName (el) {
      const cardNames = el.map((item) => {
        return {
          alias: item.zoneAlias,
          id: item.zoneId
        }
      })

      this.switchCardList = cardNames
      this.dataSource = this.setShowList(el[0])
    },

    setShowList (el) {
      const checkpointsList = []
      el.checkpoints.forEach((checkpointAlias) => {
        checkpointAlias.hosts.forEach((hostAlias) => {
          hostAlias.endpoints.forEach((metricAliasList) => {
            metricAliasList.metrics.forEach((metricAlias) => {
              checkpointsList.push({
                zoneId: checkpointAlias.checkpointAlias,
                hostId: hostAlias.hostAlias,
                endpointId: metricAliasList.endpointAlias,
                metricId: metricAlias.metricAlias
              })
            })
          })
        })
      })

      return checkpointsList
    },
    async changeZone (key) {
      // this.dataSource = await PatrolService.taskReportDetail(this.basicInfo.id, key)
    }
  }
}
</script>

<style lang="less">
</style>
