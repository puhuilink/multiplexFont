/*
 * 前转告警
 * Author: yizhu liu
 * Date: 2019-12-17 13:56:55
 * Email: lyz02413@163.com
 */
<template>
  <div class="roll-forward">
    <a-modal
      title="告警前转"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item
            label="标题"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input v-decorator="['name', {rules: [{required: true, message: '请输入视图名称！'}]}]" />
          </a-form-item>
          <a-form-item
            label="前转方式"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group :options="options" @change="onChange" defalut-value='0' />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'RollForward',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      // 前转方式
      options: [
        { label: '级别分类方式', value: '0' },
        { label: '直接转给客户', value: '1' }
      ],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    open () {
      this.visible = true
      this.form.resetFields()
    },
    onChange (e) {
      console.log('radio2 checked', e.target.value)
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style>

</style>
