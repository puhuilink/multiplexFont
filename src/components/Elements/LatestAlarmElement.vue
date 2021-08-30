<template>
  <div class="list-element">
    <AlarmMonitor
      :btnProps="btnProps"
      :columnAlign="align"
      :cTableProps="cTableProps"
      :queryParamsProps="queryParamsProps"
      :showSolve="false"
      :showQuery="false"
      :show-agent="false"
      :show-ip="false"
      :show-origin="false"
      :show-history="false"
      :show-receive="false"
      :showDeviceModel="false"
      :props-columns="columns"
      :showBtn="false"
      :showSelectRow="false"
      :showSetting="false"
      :showAlarmSelection="false"
      :showAlarmIcon="false"
      :showPagin="false"
    />
  </div>
</template>

<script>
// TODO: split common components
import AlarmMonitor from '@/views/alarm/monitor/index'
import ListMixin from '@/components/Elements/ListMixin'
import _ from 'lodash'

export default {
  name: 'LatestAlarmElement',
  inject: ['externalHostId'],
  mixins: [ListMixin],
  components: {
    AlarmMonitor
  },
  data () {
    return {
      columns: [
        {
          title: '监控对象',
          dataIndex: 'hostAlias',
          width: 290,
          show: true
        },
        {
          title: '监控实体',
          dataIndex: 'endpointAlias',
          width: 190,
          show: true,
          customRender: (text, record) => {
            const endpointAlias = _.get(record, 'endpointAlias', '')
            const endpointModelAlias = _.get(record, 'endpointModelAlias', '')
            return endpointAlias || endpointModelAlias || record.endpoint_id
          }
        },
        {
          title: '检查项',
          dataIndex: 'metricAlias',
          width: 170,
          show: true,
          customRender: (text, record) => {
            const metricAlias = _.get(record, 'metricAlias', '')
            const metricModelAlias = _.get(record, 'metricModelAlias', '')
            return metricAlias || metricModelAlias || record.metric_id
          }
        }
      ]
    }
  },
  computed: {
    cTableProps () {
      const {
        headerRowStyle,
        rowStyle,
        scroll
      } = this
      return {
        customHeaderRow: () => ({ style: headerRowStyle }),
        customRow: this.customRow,
        scroll
      }
    },
    btnProps () {
      const {
        styleConfig = {}
      } = this.elementProps
      return {
        style: styleConfig.button || {}
      }
    },
    queryParamsProps () {
      const { externalHostId } = this
      return externalHostId ? { externalHostId } : {}
    }
  }
}
</script>

<style lang="less">

</style>
