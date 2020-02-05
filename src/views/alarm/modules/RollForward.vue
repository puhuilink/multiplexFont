/*
 * 前转告警
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
      destroyOnClose
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item
            label="标题"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              placeholder="请输入标题"
              v-decorator="['title', {rules: [{required: true, message: '请输入标题！'}]}]"
            />
          </a-form-item>
          <a-form-item
            label="前转方式"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-radio-group
              :options="options"
              v-decorator="['way', { initialValue: '0' }, {rules: [{required: true, message: '请选择前转方式!'}]}]"
            />
          </a-form-item>
          <a-form-item
            label="级别选择"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-select
              v-decorator="[
                'level',
                { rules: [{ required: true, message: '请选择级别' }] },
              ]"
              placeholder="请选择级别"
            >
              <a-select-option v-for="item in checkList.level" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="故障分类"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            optionFilterProp="children"
            :filterOption="filterType"
          >
            <a-select
              v-decorator="[
                'type',
                { rules: [{ required: true, message: '请选择故障分类' }] },
              ]"
              placeholder="请选择故障分类"
            >
              <a-select-option v-for="item in checkList.type" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="描述"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-textarea placeholder="请输入描述" :rows="4" v-decorator="['description']"/>
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
      // 下拉框数据对象
      checkList: {
        level: ['INFO', 'WARNING', 'MINOR', 'MAJOR', 'CRITICAL'],
        type: ['北京故障']
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    open () {
      this.visible = true
      this.form.resetFields()
    },
    /**
     * 故障类型搜索过滤
     */
    filterType (input, option) {
      // return (
      //   option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // )
      console.log(input, option)
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
