<template>
  <fragment>
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="endpointId"
      :rowSelection="null"
      :scroll="scroll"
    >
      <template #operation>
        <AlarmStatusBadgeGroup @alarmSend="alarmChange"/>
      </template>
    </CTable>
  </fragment>
</template>

<script>
import { List } from '@/components/Mixins'
import _ from 'lodash'
import AlarmStatusBadgeGroup from './AlarmStatusBadgeGroup.vue'
import { AlarmRuleService } from '@/api'
import { pureLevelColorMapping } from '~~~/Alarm/color.config'

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
    AlarmStatusBadgeGroup
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
                style={{ color: pureLevelColorMapping.get(alarmLevel + 1) }}
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
                onClick = {() => { this.$emit('pointCheckout', record.endpointId) } }
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
                onClick = {() => this.$emit('pointCheckout', record.endpointId)}
              >查看</a-button>
            )
          }
        }
      ])
    }
  },
  methods: {
    async loadData (index) {
      console.log(this.id)
      return AlarmRuleService.hostPerformanceDetail(this.id, index, this.alarmList)
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
