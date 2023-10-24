<template>
  <fragment>
    <div>
      <CTable
        :columns="columns"
        :data="loadData"
        ref="table"
        rowKey="endpointId"
        :rowSelection="null"
        :scroll="scroll"
        style="margin-bottom: 15%"
      >
        <template #operation>
          <div style="display: flex;align-items: center">
            <AlarmStatusBadgeGroup @alarmSend="alarmChange"/>
            <TitleMsg :id="id"></TitleMsg>
          </div>
        </template>
      </CTable>
    </div>
  </fragment>
</template>

<script>
import { List } from '@/components/Mixins'
import _ from 'lodash'
import AlarmStatusBadgeGroup from './AlarmStatusBadgeGroup.vue'
import { AlarmRuleService } from '@/api'
import { pureLevelColorMapping } from '~~~/Alarm/color.config'
import TitleMsg from './TitleMsg'

const { computed, ...rest } = List
export default {
  name: 'TabPane',
  mixins: [
    {
      // scrollY 用于 props 覆盖默认 computed
      computed: _.omit(computed, ['scrollY']),
      ...rest
    }
  ],
  components: {
    AlarmStatusBadgeGroup,
    TitleMsg
  },
  props: {
    id: {
      require: true,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      alarmList: [],
      columns: Object.freeze([
        {
          title: '监控状态',
          align: 'center',
          dataIndex: 'alarmLevel',
          width: 80,
          sorter: true,
          customRender: (alarmLevel) => {
            return (
              <a-icon
                style={{ color: pureLevelColorMapping.get(alarmLevel) }}
                type="flag"
                theme="filled"/>
            )
          }
        },
        {
          title: '检查实体',
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
                onClick = {() => { record.endpointId ? this.$emit('pointCheckout', record.endpointId) : alert('无有效检查项') } }
              >
                总计指标:{record.metricCount}个;正常:{record.metricNormal}个;告警:{record.metricAlarm}个
              </a-button>
            )
          }
        },
        {
          title: '告警时间',
          align: 'center',
          dataIndex: 'alarmTime',
          width: 150,
          customRender: (__, record) => record.alarmTime || record.uploadTime || '暂无告警时间'
        },
        {
          title: '操作',
          align: 'center',
          width: 60,
          customRender: (__, record) => {
            return (
              <a-button
                type="link"
                onClick = {() => { record.endpointId ? this.$emit('pointCheckout', record) : alert('无有效检查项') }}
              >查看</a-button>
            )
          }
        }
      ])
    }
  },
  methods: {
    async loadData (index) {
      const data = AlarmRuleService.hostPerformanceDetail(this.id, index, this.alarmList)
      return data
    },
    alarmChange (data) {
      this.alarmList = data
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>
