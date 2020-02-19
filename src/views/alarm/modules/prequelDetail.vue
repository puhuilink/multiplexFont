/*
 * 前转记录详情
 */
<template>
  <a-modal
    title="前转记录详情"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="900"
    :visible="visible"
    :loading="loading"
    destroyOnClose
  >
    <a-row class="form-row" :gutter="16">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="前转编号">
          <a-input disabled :defaultValue="record.incident_id" />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="故障类型">
          <a-input disabled :defaultValue="record.incident_type" />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="故障级别">
          <a-input disabled :defaultValue="record.severity" />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="故障名称">
          <a-input disabled :defaultValue="record.incident_title" />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="发送者">
          <a-input disabled :defaultValue="record.send_by" />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="前转类型">
          <a-input disabled :defaultValue="record.forward_type" />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="前转目标">
          <a-input disabled :defaultValue="record.forward_destiationn" />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="发送时间">
          <a-input disabled :defaultValue="record.send_time" />
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="描述">
          <a-input disabled :defaultValue="record.comments" />
        </a-form-item>
      </a-col>
    </a-row>
    <template slot="footer" >
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'PrequelDetail',
  data () {
    return {
      visible: false,
      loading: false,
      record: '',
      mode: ''
    }
  },
  methods: {
    open (record, mode) {
      this.visible = true
      this.record = record
      this.mode = mode
    },
    handleDetail (e) {
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 2000)
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    /**
     * tab切换开关
     */
    onTabChange (key, type) {
      this.autoRefresh = false
      clearInterval(this.timer)
      this[type] = key
    }
  }
}
</script>

<style lang="less" scoped>
</style>
