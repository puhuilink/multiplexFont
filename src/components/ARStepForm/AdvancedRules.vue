/*
 * 规则高级设置
 */

<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="节点过滤"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'node'
          ]"
          placeholder="请选择节点过滤"
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
        label="采集系统"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          v-decorator="[
            'CIType'
          ]"
          placeholder="请选择采集系统"
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
        label="告警时间过滤"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['alarmTime', {
            initialValue: 1}
          ]"
        >
          <a-radio :value="1">任意</a-radio>
          <a-radio :value="2">绝对</a-radio>
          <a-radio :value="3">相对</a-radio>
          <a-radio :value="3">重复</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="内容关键词"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :style="{width: 'calc(100% - 100px)'}"
          v-decorator="[
            'keywords'
          ]"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import screening from '@/views/alarm/screening'
export default {
  name: 'AdvancedRules',
  data () {
    return {
      screening,
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      timer: 0,
      levelList: [
        'INFO', 'WARNING', 'MINOR', 'MAJOR', 'CRITICAL'
      ],
      alarmLevel: []
    }
  },
  methods: {
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep')
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    },
    /**
     * 告警类型改变
     */
    alarmLevelChange (value) {
      // this.queryParam.alarmType = screening.checkAll(value, this.alarmType)
      console.log(value)
      let list = value
      value.forEach(element => {
        if (element === 'checkall') {
          if (length - 1 === this.levelList && value[length - 1] === 'checkall') {
            list = []
            console.log('点击')
          } else {
            list = []
            this.levelList.forEach(m => {
              list.push(m)
              console.log(list)
              const a = this.form.getFieldsValue()
              this.form.setFieldsValue({
                alarmLevel: list
              })
              console.log(a)
            })
          }
        }
      })
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
