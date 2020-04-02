<template>
  <div class="patrol-object">
    <a-modal
      :title="record=={} ? record.ci_name + '检查项详情' : ''"
      style="top: 40px;"
      :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
      :width="900"
      :visible="visible"
      :loading="loading"
      destroyOnClose
      @cancel="handleCancel"
    >
      <a-table
        rowKey="task_kpi_id"
        :columns="innerColumns"
        :dataSource="innerData"
        size="middle"
        :pagination="false"
      />
    </a-modal>
  </div>
</template>

<script>
import { getTaskKpi } from '@/api/controller/patrol'

export default {
  name: 'KpiList',
  components: {
  },
  data () {
    return {
      visible: false,
      loading: false,
      // 内联列表表头
      innerColumns: [
        {
          title: '检查项名称',
          dataIndex: 'kpi_name',
          width: 150
        },
        {
          title: '检查结果',
          dataIndex: 'task_kpi_status',
          width: 100
        },
        {
          title: '是否异常',
          dataIndex: 'kpi_value'
        }
      ],
      innerData: [],
      record: {}
    }
  },
  filters: {},
  computed: {},
  methods: {
    async open (record, mode) {
      this.visible = true
      this.record = record
      this.loadKpiData(record)
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    loadKpiData (record) {
      console.log(record)
      this.innerData = []
      const variables = {
        where: {
          ...record ? {
            task_code: {
              _eq: record.task_code
            }
          } : {},
          ...record ? {
            urmp_ci_code: {
              _eq: record.urmp_ci_code
            }
          } : {}
        }
      }
      getTaskKpi(variables).then(r => {
        this.innerData = r.data.task_kpi
      })
    }
  }
}
</script>

<style scoped lang='less'>
</style>
