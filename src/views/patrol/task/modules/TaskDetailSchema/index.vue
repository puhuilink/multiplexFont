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
            <span>任务名称：{{ basicInfo.task_name }}</span>
          </a-col>
          <a-col :span="12">
            <span>任务单号：{{ basicInfo.task_id }}</span>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="6">
            <span>开始时间：{{ basicInfo.real_start_time | time }}</span>
          </a-col>
          <a-col :span="6">
            <span>完成时间：{{ basicInfo.real_end_time | time }}</span>
          </a-col>
          <a-col :span="6">
            <span>执行人：{{ basicInfo.transactor_name }}</span>
          </a-col>
          <a-col :span="6">
            <span>是否延迟执行：{{ basicInfo.is_delay | delay }}</span>
          </a-col>
        </a-row>
      </div>

      <!-- 点位信息 -->
      <div class="TaskDetailSchema__pointsInfo">
        <a-tabs default-active-key="id" @change="changeTitle">
          <a-tab-pane v-for="{ alias, id } in switchCardList" :key="id" :tab="alias">
            <a-table bordered :columns="columns" :dataSource="dataSource" :scroll="scroll"></a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import { PatrolService } from '@/api'
import { DELAY_MAPPING } from '../../../typing'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'TaskDetailSchema',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    columns: Object.freeze([
      {
        title: '点位',
        dataIndex: 'zoneId',
        width: 180,
      },
      {
        title: '柜位',
        dataIndex: 'hostId',
        width: 180,
      },
      {
        title: '设备',
        dataIndex: 'endpointId',
        width: 180,
      },
      {
        title: '检查项',
        dataIndex: 'metricId',
        width: 180,
      },
      {
        title: '值',
        dataIndex: 'value',
        width: 180,
      },
      {
        title: '备注',
        dataIndex: 'note',
        width: 180,
      },
      {
        title: '图片',
        dataIndex: 'imagePathList',
        width: 180,
      },
    ]),
    dataSource: [],
    record: {},
    spinning: false,
    switchCardList: [],
    taskDetail: [],
  }),
  filters: {
    delay(delay) {
      return DELAY_MAPPING.get(delay)
    },
    time(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  computed: {
    basicInfo() {
      return this.record.basicInfo || {}
    },
    pointsInfo() {
      return this.record.rfInfo || {}
    },
    scroll() {
      return {
        x: _.sum(this.columns.map((e) => e.width || 60)),
        y: 300,
      }
    },
  },
  methods: {
    async fetch(task_id) {
      try {
        this.spinning = true
        const {
          basicInfo: { content },
        } = await PatrolService.taskDetail(task_id)
        this.taskDetail = content
        this.switchCardName(this.taskDetail)
      } catch (e) {
        this.taskDetail = []
        this.record = {}
        throw e
      } finally {
        this.spinning = false
      }
    },
    detail(task_id) {
      this.show('巡更记录单')
      this.fetch(task_id)
    },

    switchCardName(el) {
      const cardNames = el.map((item) => {
        return {
          alias: item.zoneAlias,
          id: item.zoneId,
        }
      })

      this.switchCardList = cardNames
      this.dataSource = this.setShowList(el[0])
    },

    setShowList(el) {
      const checkpointsList = []
      el.checkpoints.forEach((checkpointAlias) => {
        checkpointAlias.hosts.forEach((hostAlias) => {
          hostAlias.endpoints.forEach((metricAliasList) => {
            metricAliasList.metrics.forEach((metricAlias) => {
              checkpointsList.push({
                zoneId: checkpointAlias.checkpointAlias,
                hostId: hostAlias.hostAlias,
                endpointId: metricAliasList.endpointAlias,
                metricId: metricAlias.metricAlias,
              })
            })
          })
        })
      })

      return checkpointsList
    },
    changeTitle(key) {
      const index = this.switchCardList.findIndex((itemId) => itemId.id === key)
      this.dataSource = this.setShowList(this.taskDetail[index])
    },
  },
}
</script>

<style lang="less">
</style>
