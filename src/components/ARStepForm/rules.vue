<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="域选择"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'domian',
            { rules: [{ required: true, message: '请选择域' }] },
          ]"
          placeholder="请选择域"
        >
          <a-select-opt-group
            v-for="(group,index) in screening.CIDomain"
            :key="index"
            :label="group.label"
          >
            <a-select-option
              v-for="item in group.options"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <a-form-item
        label="类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'CIType',
            { rules: [{ required: true, message: '请选择类型' }] },
          ]"
          placeholder="请选择类型"
        >
          <a-select-opt-group
            v-for="(group,index) in screening.CIType"
            :key="index"
            :label="group.label"
          >
            <a-select-option
              v-for="item in group.options"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <a-form-item
        label="告警类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'alarmType',
            { rules: [{ required: true, message: '请选择告警类型' }] },
          ]"
          placeholder="请选择告警类型"
        >
          <a-select-opt-group
            v-for="(group,index) in screening.alarmType"
            :key="index"
            :label="group.label"
          >
            <a-select-option
              v-for="item in group.options"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import screening from '@/views/alarm/screening'
export default {
  name: 'Step2',
  data () {
    return {
      screening,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      timer: 0
    }
  },
  methods: {
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          console.log('表单 values', values)
          that.timer = setTimeout(function () {
            that.loading = false
            that.$emit('nextStep')
          }, 1500)
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
