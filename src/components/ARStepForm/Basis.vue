<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="规则名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :style="{width: 'calc(100% - 100px)'}"
          v-decorator="['title', {
            initialValue: record.title,
            rules: [{required: true, message: '规则名称必须填写'}]}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="规则模式"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['ruleMode', {
            initialValue: record.ruleMode,
            rules: [{required: true, message: '规则模式必须填写'}]}
          ]"
        >
          <a-radio value="0">正常模式</a-radio>
          <a-radio value="1">日志模式</a-radio>
          <a-radio value="2">测试模式</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="规则优先级"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['priority', {
            initialValue: record.priority,
            rules: [{required: true, message: '启用必须填写'}]}
          ]"
        >
          <a-radio value="0">低</a-radio>
          <a-radio value="10">中</a-radio>
          <a-radio value="20">高</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="启用"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['enabled', {
            initialValue: record.enabled,
            rules: [{required: true, message: '启用必须填写'}]}
          ]"
        >
          <a-radio value="true">是</a-radio>
          <a-radio value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
  </div>
</template>

<script>
export default {
  name: 'Basis',
  props: {
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
