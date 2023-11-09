<template>
  <a-modal
    centered
    :title="title"
    :footer="null"
    :width="920"
    wrapClassName="HistoryChart__modal"
    v-model="visible"
    @cancel="cancel"
    :afterClose="reset"
    okText="提交"
    @ok="cancel"
  >
    <a-spin :spinning="spinning">
      <figure class="HistoryChart__chart" ref="chart"></figure>
    </a-spin>
  </a-modal>
</template>

<script>
import Schema from '@/components/Mixins/Modal/Schema'
import moment from 'moment'
import { AlarmRuleService } from '@/api'
import echarts from 'echarts'
import { AdaptorComboConfig } from '@/model/config/dataConfig/dynamicData/common/AdaptorComboConfig'
import LinesDynamicDataConfig from '@/model/config/dataConfig/dynamicData/LinesDynamicDataConfig'
import { autoTooltipPosition } from '@/utils/echarts'
import _ from 'lodash'

export default {
  name: 'HistoryChart',
  mixins: [Schema],
  components: {},
  props: {},
  data: () => ({
    $chart: null,
    queryStartTime: [moment().subtract('days').format('YYYY-MM-DD HH:mm:ss')],
    queryEndTime: [moment().add(-3, 'hours').format('YYYY-MM-DD HH:mm:ss')],
    spinning: false
  }),
  computed: {},
  methods: {
    moment,
    showHistory (children) {
      this.historyDataList = children
      this.show(this.modalTitle)
      this.fetch()
      this.initChart()
    },
    async fetch () {
      try {
        this.spinning = true
        const { data } = await AlarmRuleService.historyAlarmDataView(this.queryStartTime, this.queryEndTime, this.historyDataList)
        if (_.isEmpty(data)) {
          alert('暂无数据')
          this.cancel()
        } else {
          const dataList = AdaptorComboConfig.transfer(data)
          const option = LinesDynamicDataConfig.transferComboDataOption(dataList)
          this.title = `${Object.keys(data)[0] || ''}历史图`
          this.$chart.setOption({
            ...option,
            title: { text: '' },
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
              position: autoTooltipPosition
            }
          }, true)
        }
      } finally {
        this.spinning = false
      }
    },
    initChart () {
      setTimeout(() => {
        this.$chart = echarts.init(this.$refs['chart'], '', { renderer: 'canvas' })
      })
    }
  }
}
</script>

  <style lang="less">
  .HistoryChart {
    &__chart {
      width: 100%;
      height: 600px;
    }
  }
  </style>
