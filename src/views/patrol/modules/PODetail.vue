/*
 * 巡更检查对象 详情
 */
<template>
  <a-modal
    title="巡更检查对象详情"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="1000"
    :visible="visible"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <template>
      <detail-list title="">
        <detail-list-item term="任务名称">{{ taskDetailInfo.task_name }}</detail-list-item>
        <detail-list-item term="任务单号">{{ taskDetailInfo.task_code }}</detail-list-item>
        <detail-list-item term="任务类型">{{ taskDetailInfo.task_type }}</detail-list-item>
        <detail-list-item term="默认执行人">{{ taskDetailInfo.df_transactor_name }}</detail-list-item>
        <detail-list-item term="开始时间">{{ taskDetailInfo.real_start_time }}</detail-list-item>
        <detail-list-item term="结束时间">{{ taskDetailInfo.real_end_time }}</detail-list-item>
        <detail-list-item term="执行人">{{ taskDetailInfo.transactor_name }}</detail-list-item>
        <detail-list-item term="是否延迟执行">{{ taskDetailInfo.is_delay }}</detail-list-item>
      </detail-list>
    </template>

    <template v-for="rf in taskRfList">
      <a-collapse :key="rf.task_rf_id">
        <a-collapse-panel :key="rf.task_rf_id" :header="rf.rf_name">
          <detail-list
            v-for="ci in rf.ciList"
            :key="ci.task_ci_id"
            :title="ci.ci_name"
          >
            <detail-list-item
              v-for="kpi in ci.kpiList"
              :key="kpi.task_kpi_id"
              :term="kpi.kpi_name"
            >
              {{ kpi.kpi_value }}
            </detail-list-item>
          </detail-list>
        </a-collapse-panel>
      </a-collapse>
    </template>

    <template slot="footer" >
      <a-button @click="handleCancel">返回</a-button>
    </template>

  </a-modal>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import { getTaskPointDetail } from '@/api/controller/patrol'

const DetailListItem = DetailList.Item
const query = gql`query MyQuery ($taskCode: String!){
  data: t_xj_task_info(where: {task_code: {_eq: $taskCode}}) {
    ascription
    create_time
    df_group_code
    df_transactor_name
    df_transactor_code
    group_code
    is_delay
    is_df_transactor
    is_enable
    plan_code
    plan_end_time
    plan_start_time
    real_end_time
    update_time
    transactor_name
    transactor_code
    task_type
    task_status
    task_state
    task_name
    task_late_start_time
    task_id
    task_fail_time
    task_delay_time
    task_code
    task_can_start_time
    route_code
    real_sum_time
    real_start_time
  }
}`
export default {
  name: 'PODetail',
  components: {
    DetailList,
    DetailListItem
  },
  data () {
    return {
      visible: false,
      loading: false,
      record: '',
      taskDetailInfo: {},
      taskRfList: []
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  methods: {
    async open (record) {
      this.visible = true
      this.record = record
      this.getTaskDetail(record.task_code)
      this.getTaskPointList(record.task_code)
    },
    getTaskDetail (tCode) {
      return apollo.clients.alert.query({
        query,
        variables: {
          taskCode: tCode
        }
      }).then(r => {
        this.taskDetailInfo = r.data.data[0]
      })
    },
    getTaskPointList (tCode) {
      const variables = {
        taskCode: tCode
      }
      return getTaskPointDetail(variables).then(r => {
        const rfList = r.data.rfList
        const ciList = r.data.ciList
        ciList.forEach(ci => {
          const kpiList = []
          r.data.kpiList.forEach(kpi => {
            if (kpi.urmp_ci_code === ci.urmp_ci_code) {
              kpiList.push(kpi)
              ci.kpiList = kpiList
            }
          })
        })
        rfList.forEach(point => {
          const ciListShort = []
          r.data.ciList.forEach(ci => {
            if (ci.urmp_rf_code === point.urmp_rf_code) {
              ciListShort.push(ci)
              point.ciList = ciListShort
            }
          })
        })
        this.taskRfList = rfList
      })
    },
    handleCancel (e) {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
