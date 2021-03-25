
<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="QuotaSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    cancelText="取消"
    @ok="submit">

    <!-- okText="保存" -->
    <CTable
      v-show="alarmRecord"
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="endpointId"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- 告警等级通知 -->
      <!-- <div class="operation" slot="operation">
        <div class="AlarmMonitor__operation-badge-group">
          <span>告警级别：</span>
          <span class="alarmStyle urgent">紧急</span>
          <span class="alarmStyle alarmMain">主要</span>
          <span class="alarmStyle secondary">次要</span>
          <span class="alarmStyle commonly">一般</span>
          <span class="alarmStyle normal">正常</span>
        </div>
      </div> -->
    </CTable>

    <CTable
      v-if="alarmRecordDetails"
      :columns="columnsDetails"
      :data="loadDataDetails"
      ref="tableAlarm"
      rowKey="endpointIds"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- 告警等级通知 -->
      <div class="operation" slot="operation">
        <div class="AlarmMonitor__operation-badge-group">
          <!-- <span>告警级别：</span>
          <span class="alarmStyle urgent">紧急</span>
          <span class="alarmStyle alarmMain">主要</span>
          <span class="alarmStyle secondary">次要</span>
          <span class="alarmStyle commonly">一般</span>
          <span class="alarmStyle normal">正常</span> -->
          <span @click="upfloor" class="upfloor normal">返回上一层数据</span>
        </div>
      </div>
    </CTable>

    <HistoryChart ref="historyChart" />

  </a-modal>
</template>

<script>
import { List } from '@/components/Mixins'
import Schema from '@/components/Mixins/Modal/Schema'
import { AlarmRuleService } from '@/api'
import HistoryChart from './AlarmHistoryChart'

export default {
  name: 'AlarmPopupDetails',
  mixins: [Schema, List],
  components: {
    HistoryChart
  },
  data () {
    return {
      confirmLoading: false,
      submit: () => {},
      columns: Object.freeze([
        {
          title: '监控状态',
          dataIndex: 'status',
          width: 80
        },
        {
          title: '监控实体',
          dataIndex: 'endpointAlias',
          width: 160
        },
        {
          title: '告警情况',
          dataIndex: 'alarmListCount',
          width: 180,
          customRender: (__, record) => {
            return `总计指标: ${record.metricCount}  正常 ${record.metricNormal}个 , 告警 ${record.metricAlarm}个 `
          }
        },
        {
          title: '更新时间',
          dataIndex: 'uploadTime',
          width: 160
        },
        {
          title: '操作',
          dataIndex: 'alarmClick',
          width: 60,
          customRender: (__, record) => {
            return <span style={{
              color: '#2d97ff',
              cursor: 'pointer'
            }}
            onClick = {() => this.alarmSingleDetails(record)}
            >查看</span>
          }
        }
      ]),
      alarmRecord: true,
      alarmRecordDetails: false,
      columnsDetails: Object.freeze([
        {
          title: '监控状态',
          dataIndex: 'status',
          width: 80
        },
        {
          title: '检查项',
          dataIndex: 'metricAlias',
          width: 160
        },
        {
          title: '状态描述',
          dataIndex: 'metricModelAlias',
          width: 180
        },
        {
          title: '更新时间',
          dataIndex: 'uploadTime',
          width: 160
        },
        {
          title: '下次采集时间',
          dataIndex: 'nextTime',
          width: 160
        },
        {
          title: '采集周期',
          dataIndex: 'collectInterval',
          width: 160
        },
        {
          title: '采集方式',
          dataIndex: 'collectType',
          width: 160
        },
        {
          title: '历史图',
          width: 160,
          customRender: (__, record) => {
            return <a-button style={{
              color: '#2d97ff',
              cursor: 'pointer'
            }}
            onClick = {() => this.onShowHistory(record)}
            >图表</a-button>
          }
        }
      ])
    }
  },
  methods: {
    /**
       * 打开闪烁告警问题弹窗
       */
    async add (drillAlarm) {
      this.submit = this.searchDetails
      this.show('监控对象')
      this.drillAlarm = drillAlarm
      await this.$nextTick()
      this.$refs['table'].refresh(true)
    },
    async searchDetails () {
      this.confirmLoading = false
    },

    // 首次展示内容数据接口
    async loadData (drillAlarm) {
      const [{ hostId }] = this.drillAlarm
      return AlarmRuleService.AlarmPopupDetail(hostId).then((res) => {
        return res.data
      })
    },

    // 告警点击查看当前所在数据的内容详情
    async  alarmSingleDetails (record) {
      this.endpointId = record.endpointId
      this.endpointModelId = record.endpointModelId

      if (record.endpointId !== '') {
        this.alarmRecord = false
        this.alarmRecordDetails = true
        this.endpointId = record.endpointId
      }
      await this.$nextTick()
      this.$refs['tableAlarm'].refresh(true)
    },

    // 点击查看详细内容数据接口
    async loadDataDetails () {
      const record = this.endpointId
      return AlarmRuleService.AlarmRecordDetails(record).then((res) => {
        return res.data
      })
    },
    // 返回 上一次 点击时间
    upfloor () {
      this.alarmRecord = true
      this.alarmRecordDetails = false
    },

    async onShowHistory (record) {
      const content = []
      content.push({
        AlarmhostId: this.drillAlarm[0].hostId, // 设备id
        endpointId: this.endpointId, // 第一展示单个问题 id
        endpointModelId: this.endpointModelId, // 第一展示单个问题 id
        metricId: record.metricId, // 第二次请求id
        metricModelId: record.metricModelId // 第二次请求id
      })
      this.$refs['historyChart'].AlarmonShowHistory(content[0])
    }

  }
}
</script>

  <style lang="less">
    .AlarmMonitor {
    &__operation {
      display: flex;
      flex-direction: row;
      width: 100%;

      &-badge-group {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex: 1;
        margin-left: 8px;
      }
    }
  }
  .alarmStyle{
      width: 60px;
      height: 24px;
      color: #fff;
      text-align: center;
      font-weight: 300;
      border-radius: 20px;
      margin-right: 15px;
    }
    .upfloor{
      width: 140px;
      height: 24px;
      color: #fff;
      text-align: center;
      font-weight: 300;
      border-radius: 10px;
      margin-right: 15px;
      padding:-3px 5px 5px 5px;
      cursor:pointer;
    }

    .urgent{
      background: #ff0202;
    }
    .alarmMain{
      background: #f68808;
    }
    .secondary{
      background:#ffdb00
    }
    .commonly{
      background: #2d97ff
    }
    .normal{
      background: #06c357
    }
  </style>
