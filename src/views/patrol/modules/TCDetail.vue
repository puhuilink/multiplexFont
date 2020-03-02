/*
 * 任务日历详情
 */
<template>
  <a-modal
    :title="'详情'"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="900"
    :visible="visible"
    :loading="loading"
    :footer="null"
    destroyOnClose
    @cancel="handleCancel"
  >
    <a-row class="form-row" :gutter="16">
      巡检日历详情
    </a-row>

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
      record: ''
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
      this.record = record
      console.log(record)
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
