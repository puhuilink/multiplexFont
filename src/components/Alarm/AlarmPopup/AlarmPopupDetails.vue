
<template>
  <a-modal
    :afterClose="reset"
    cancelText="取消"
    centered
    :confirmLoading="confirmLoading"
    :footer="null"
    :title="title"
    :width="1140"
    v-model="visible"
    wrapClassName="AlarmPopupDetail__modal"
    @cancel="cancel"
    @ok="submit">

    <CTable
      v-show="alarmRecord"
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="endpointId"
      :rowSelection="null"
      :scroll="scroll"
    >

      <template #operation>
        <AlarmStatusBadgeGroup />
      </template>
    </CTable>

    <CTable
      v-if="alarmRecordDetails"
      :columns="detailColumns"
      :data="loadDataDetails"
      ref="tableAlarm"
      rowKey="endpointIds"
      :rowSelection="null"
      :scroll="scroll"
    >

      <template #operation>
        <AlarmStatusBadgeGroup />
      </template>

      <template #footer>
        <a-button type="link" @click="back">&lt;&nbsp;返回</a-button>
      </template>
    </CTable>

    <HistoryChart ref="historyChart" />

  </a-modal>
</template>

<script>
import { List } from '@/components/Mixins'
import Schema from '@/components/Mixins/Modal/Schema'
import { AlarmRuleService } from '@/api'
import HistoryChart from './AlarmHistoryChart'
import { pureLevelColorMapping } from '@/components/Alarm/color.config'
import AlarmStatusBadgeGroup from './AlarmStatusBadgeGroup.vue'

export default {
  name: 'AlarmPopupDetails',
  mixins: [Schema, List],
  components: {
    AlarmStatusBadgeGroup,
    HistoryChart
  },
  data () {
    return {
      confirmLoading: false,
      submit: () => {},
      columns: Object.freeze([
        {
          title: '监控状态',
          align: 'center',
          dataIndex: 'alarmLevel',
          width: 80,
          customRender: (alarmLevel) => {
            return (
              <a-icon
                style={{ color: pureLevelColorMapping.get(alarmLevel) }}
                type="flag"
                theme="filled"
              />
            )
          }
        },
        {
          title: '监控实体',
          align: 'left',
          dataIndex: 'endpointAlias',
          width: 160
        },
        {
          title: '告警情况',
          align: 'center',
          width: 180,
          customRender: (__, record) => {
            return (
              <a-button
                type="link"
                onClick = {() => this.alarmSingleDetails(record)}
              >
                总计指标:{record.metricCount}个;正常:{record.metricNormal}个;告警:{record.metricAlarm}个
              </a-button>
            )
          }
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'uploadTime',
          width: 150
        },
        {
          title: '操作',
          align: 'center',
          width: 60,
          customRender: (__, record) => {
            return (
              <a-button
                type="link"
                onClick = {() => this.alarmSingleDetails(record)}
              >查看</a-button>
            )
          }
        }
      ]),
      alarmRecord: true,
      alarmRecordDetails: false,
      detailColumns: Object.freeze([
        {
          title: '监控状态',
          align: 'center',
          dataIndex: 'alarmLevel',
          width: 80,
          customRender: (alarmLevel) => {
            return (
              <a-icon
                style={{ color: pureLevelColorMapping.get(alarmLevel) }}
                type="flag"
                theme="filled"
              />
            )
          }
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
          align: 'center',
          dataIndex: 'uploadTime',
          width: 155
        },
        {
          title: '下次采集时间',
          align: 'center',
          dataIndex: 'nextTime',
          width: 155
        },
        {
          title: '采集周期',
          align: 'center',
          dataIndex: 'collectInterval',
          width: 90
        },
        {
          title: '采集方式',
          align: 'center',
          dataIndex: 'collectType',
          width: 90
        },
        {
          title: '历史图',
          align: 'center',
          width: 60,
          customRender: (__, record) => {
            return (
              <a-icon
                style={{ color: 'rgb(0, 152, 255)' }}
                type="bar-chart"
                onClick = {() => this.onShowHistory(record)}
              />
            )
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
    },

    // 点击查看详细内容数据接口
    async loadDataDetails () {
      const record = this.endpointId
      return AlarmRuleService.AlarmRecordDetails(record).then((res) => {
        return res.data
      })
    },

    back () {
      this.alarmRecord = true
      this.alarmRecordDetails = false
    },

    async onShowHistory (record) {
      this.$refs['historyChart'].showHistory({
        AlarmhostId: this.drillAlarm[0].hostId, // 设备id
        endpointId: this.endpointId, // 第一展示单个问题 id
        endpointModelId: this.endpointModelId, // 第一展示单个问题 id
        metricId: record.metricId, // 第二次请求id
        metricModelId: record.metricModelId // 第二次请求id
      })
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
.back{
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

.AlarmPopupDetail__modal {

  .ant-table-content {
    position: relative;
  }

  .ant-table-footer {
    position: absolute;
    bottom: -62px;
    left: 0;
    background-color: #fff;
  }
}
</style>
