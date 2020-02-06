/*
 * 解决告警
 */
<template>
  <a-modal
    title="解决告警"
    :width="640"
    :visible="visible"
    @ok="handleSolve"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item
          label="处理意见"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea placeholder="请输入处理意见" :rows="4" v-decorator="['description']"/>
        </a-form-item>
        <a-form-item
          label="选项"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-checkbox-group
            :options="options"
            v-decorator="['checkbox', { initialValue: ['0'] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'MSolve',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      visible: false,
      loading: false,
      options: [
        { label: '解决子告警', value: '0' },
        { label: '设置为忽略', value: '1' },
        { label: '清除内存', value: '2' }
      ],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    handleSolve (e) {
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 2000)
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
