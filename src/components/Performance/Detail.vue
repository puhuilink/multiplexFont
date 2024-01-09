<template>
  <div class="PerformanceDetail">

    <a-tabs v-model="activeKey" hide-add type="editable-card" @edit="onEdit">
      <a-tab-pane
        :key="hostId"
        :closable="false"
        tab="主机信息"
        type="editable-card"
      >
        <tabPane :id="hostId" @pointCheckout="alarmSingleDetails"></tabPane>
      </a-tab-pane>
      <a-tab-pane v-for="(pane) in panes" :key="pane.key" :tab="pane.title" :closable="true">
        <TabPaneEndpoint :id="pane.key" :hostId="hostId" @historyView="onShowHistory"></TabPaneEndpoint>
      </a-tab-pane>
    </a-tabs>
    <HistoryChart ref="historyChart" />
  </div>
</template>

<script>
import _ from 'lodash'
import { List } from '@/components/Mixins'
import { AlarmRuleService } from '@/api'
import AlarmStatusBadgeGroup from './AlarmStatusBadgeGroup.vue'
import HistoryChart from './History.vue'
import { CmdbEndpointService } from '@/api/service/CmdbEndpointService'
import tabPane from './tabPane'
import TabPaneEndpoint from '~~~/Performance/tabPaneEndpoint'
const { computed, ...rest } = List

export default {
  name: 'PerformanceDetail',
  mixins: [
    {
      // scrollY 用于 props 覆盖默认 computed
      computed: _.omit(computed, ['scrollY']),
      ...rest
    }
  ],
  components: {
    AlarmStatusBadgeGroup,
    HistoryChart,
    tabPane,
    TabPaneEndpoint
  },
  props: {
    hostId: {
      require: true,
      type: String,
      default: ''
    },
    scrollY: {
      type: String,
      default: 'max(calc(100vh - 320px), 100px)'
    }
  },
  data () {
    return {
      alarmList: [1, 2, 3, 4],
      activeKey: '',
      panes: [],
      titleMsg: {},
      endpointModelId: ''
    }
  },
  watch: {
    'hostId': {
      immediate: true,
      handler: async function () {
        this.activeKey = this.hostId
        this.panes = []
      }
    },
    'panes': {
      immediate: true,
      handler: function (value) {
        if (_.isEmpty(value)) {
          this.activeKey = this.hostId
        }
      }
    }
  },
  methods: {
    // 告警点击查看当前所在数据的内容详情
    async  alarmSingleDetails (record) {
      if (record !== '') {
        this.endpointId = record.endpointId
        this.endpointModelId = record.endpointModelId
        if (!_.includes(this.panes.map(el => el.key), this.endpointId)) {
          this.panes.push({
            key: this.endpointId,
            column: this.detailColumns,
            alarmLevel: [],
            title: await CmdbEndpointService.find({
              where: { endpoint_id: this.endpointId },
              fields: [
                'alias',
                'endpointModelId: endpoint_model_id'
              ],
              alias: 'data'
            }).then(r => {
              const data = _.first(r.data.data)
              // if (data.endpointModelId) {
              //   this.endpointModelId = data.endpointModelId
              // }
              return data.alias
            })
          })
          this.activeKey = this.endpointId
        }
      }
    },

    // 点击查看详细内容数据接口
    async loadDataDetails (index) {
      const record = this.endpointId
      return AlarmRuleService.endpointPerformanceDetail(record, index, this.alarmChange)
    },

    alarmChange (data) {
      this.alarmList = data
    },

    async onShowHistory (record) {
      this.$refs['historyChart'].showHistory({
        AlarmhostId: this.hostId, // 设备id
        endpointId: this.endpointId, // 第一展示单个问题 id
        endpointModelId: this.endpointModelId, // 第一展示单个问题 id
        metricId: record.metricId, // 第二次请求id
        metricModelId: record.metricModelId // 第二次请求id
      })
    },

    // 删除导航栏
    remove (targetKey) {
      let activeKey = this.activeKey
      let lastIndex
      if (_.isNull(this.panes)) {
        this.activeKey = this.hostId
      } else {
        this.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1
          }
        })
        const panes = this.panes.filter(pane => pane.key !== targetKey)
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key
          } else {
            activeKey = panes[0].key
          }
        }
        this.panes = panes
        this.activeKey = activeKey
      }
    },

    onEdit (targetKey, action) {
      this[action](targetKey)
    }
  }
}
</script>

<style lang="less" scoped>
.PerformanceDetail {
  .ant-table-content {
    position: relative;
  }

  .ant-table-footer {
    position: absolute;
    bottom: -62px;
    left: 0;
    background-color: transparent;
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
}
</style>
