/*
 * 告警升级设置
 */
<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="升级周期"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          addonAfter="分钟"
          min="0"
          max="100000"
          v-decorator="['duration', { initialValue: record.duration}]"
        />
      </a-form-item>
      <a-form-item
        label="告警数量门限"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          min="0"
          max="100000"
          v-decorator="['count', { initialValue: record.count}]"
        />
      </a-form-item>
      <a-form-item
        label="升级次数限制"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          min="0"
          max="1000"
          v-decorator="['maxUpgrade', { initialValue: record.maxUpgrade}]"
        />
      </a-form-item>
      <a-form-item
        label="目标级别"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['targetSeverity1', {
            initialValue: record.targetSeverity1}
          ]"
          @change="targetSeverity1Change"

        >
          <a-radio value="11">升级</a-radio>
          <a-radio value="12">降级</a-radio>
          <a-radio value="0">至固定级别</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        v-show="targetSeverity1==='0'"
        label="固定级别"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['targetSeverity2', {
            initialValue: record.targetSeverity1}
          ]"
        >
          <a-radio value="0">INFO</a-radio>
          <a-radio value="1">WARNING</a-radio>
          <a-radio value="2">MINOR</a-radio>
          <a-radio value="3">MAJOR</a-radio>
          <a-radio value="4">CRITICAL</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" :loading="loading" type="primary" @click="nextStep">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import screening from '@/views/alarm/screening'

export default {
  name: 'AlarmUpgrade',
  props: {
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      screening,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      targetSeverity1: ''
    }
  },
  methods: {
    targetSeverity1Change (e) {
      this.targetSeverity1 = e.target.value
    },
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          that.loading = false
          that.$emit('handleSubmit', values)
        } else {
          that.loading = false
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>
