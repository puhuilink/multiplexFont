/*
 * 前转子条件
 */

<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="新的告警类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'domian'
          ]"
          placeholder="请选择"
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
        label="新的告警标记"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['newTag', {
            initialValue: 0}
          ]"
        >
          <a-radio :value="0">添加</a-radio>
          <a-radio :value="1">重置</a-radio>
          <a-radio :value="2">删除</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label=" "
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          mode="multiple"
          allowClear
          v-decorator="[
            'newTag2'
          ]"
          @change="alarmLevelChange"
        >
          <a-select-option value="checkall" key="checkall">全选</a-select-option>
          <a-select-option
            v-for="item in levelList"
            :key="item"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
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
  name: 'AFCondition',
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
            that.$emit('handleSubmit')
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
