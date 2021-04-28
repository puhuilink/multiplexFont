<template>
  <fragment>
    <CTable
      :columns="detailColumns"
      :data="loadDataDetails"
      rowKey="endpointIds"
      :rowSelection="null"
      :scroll="scroll"
      ref="column"
    >
      <template #operation>
        <div style="display: flex;align-items: center">
          <AlarmStatusBadgeGroup @alarmSend="alarmChange"/>
          <TitleMsg :id="hostId"></TitleMsg>
        </div>
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
import TitleMsg from './TitleMsg'

const { computed, ...rest } = List
export default {
  name: 'TabPaneEndpoint',
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
    },
    hostId: {
      require: true,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      alarmList: [],
      detailColumns: Object.freeze([
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
                theme="filled"
              />
            )
          }
        },
        {
          title: '检查项',
          dataIndex: 'metricAlias' && 'metricModelAlias',
          width: 160
        },
        {
          title: '状态描述',
          dataIndex: 'detail',
          width: 180
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'uploadTime',
          width: 155
        },
        {
          title: '采集周期',
          align: 'center',
          dataIndex: 'collectInterval',
          width: 90,
          customRender: (collectInterval) => {
            return (
              `${collectInterval}秒`
            )
          }
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
                onClick = {() => this.$emit('historyView', record)}
              />
            )
          }
        }
      ])
    }
  },
  methods: {
    async loadDataDetails (index) {
      const record = this.id
      return AlarmRuleService.endpointPerformanceDetail(record, index, this.alarmList)
    },
    alarmChange (data) {
      this.alarmList = data
      this.$refs.column.refresh()
    }
  }
}
</script>

<style scoped>

</style>
