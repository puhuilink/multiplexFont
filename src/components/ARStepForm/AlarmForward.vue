/*
 * 告警前转设置
 */
<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="故障级别"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          mode="multiple"
          allowClear
          placeholder=""
          v-decorator="[
            'alarmLevel',
            { rules: [{ required: true, message: '请选择故障级别' }] },
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
      <a-form-item
        label="故障分类"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          style="width: 100%"
          v-decorator="['alarmLevel', {
            initialValue: '',
            rules: [{ required: true, message: '故障分类不能为空!' }]
          }]"
        >
          <a-select-option
            v-for="item in screening.levelList"
            :key="item.level"
            :value="item.level"
          >
            {{ item.text }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="告警数量"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          style="width: 100%"
          v-decorator="['alarmCount', { initialValue: '' }]"
        />
      </a-form-item>
      <a-form-item
        label="活动周期"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          style="width: 100%"
          v-decorator="['timeNum', { initialValue: '' }]"
        />
      </a-form-item>
      <a-form-item
        label="活动周期单位"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          allowClear
          style="width: 100%"
          v-decorator="['time', {
            initialValue: ''
          }]"
          placeholder="请选择"
        >
          <a-select-option value="0">分钟</a-select-option>
          <a-select-option value="1">小时</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="事件描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="['icon', { initialValue: '', rules: [{ required: true, message: '显示名称不能为空!' }] }]"
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
  name: 'AlarmForWard',
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
      ]
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
