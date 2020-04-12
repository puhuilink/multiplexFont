/*
 * 任务日历详情
 */
<template>
  <a-modal
    :title="'任务详情'"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="900"
    :visible="visible"
    :loading="loading"
    :footer="null"
    destroyOnClose
    @cancel="handleCancel"
  >
    <h4>
      <!-- {{ recordList[0].work_start_date || '' }} -->
    </h4>
    <a-table
      size="small"
      row-key="work_start_time"
      :columns="columns"
      :dataSource="recordList"
      :pagination="false"
    />
  </a-modal>
</template>

<script>
export default {
  name: 'TCDetail',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      recordList: '',
      columns: [
        {
          title: '状态',
          dataIndex: 'work_state'
        },
        {
          title: '开始时间',
          dataIndex: 'work_start_time'
        },
        {
          title: '任务名称',
          dataIndex: 'task_name'
        },
        // TODO: 这里的人员是展示默认值吗
        {
          title: '人员',
          dataIndex: 'df_transactor_name'
        }
      ]
    }
  },
  beforeCreate () {
  },
  created () {
    window.form = this.form
    // this.form.setFieldsValue(record)
  },
  beforeMount () {
  },
  methods: {
    async open (record) {
      this.visible = true
      this.recordList = record
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
