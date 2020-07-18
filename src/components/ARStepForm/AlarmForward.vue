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
          placeholder="请选择故障级别"
          v-decorator="[
            'incidentSeverity',
            {
              initialValue: record.incidentSeverity
            }
          ]"
        >
          <!-- @change="alarmLevelChange" -->
          <!-- <a-select-option value="checkall" key="checkall">全选</a-select-option> -->
          <a-select-option
            v-for="item in screening.severityList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
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
          v-decorator="['incidentType', {
            initialValue: record.incidentType
          }]"
        >
          <a-select-option
            v-for="item in queryList.faultList"
            :key="item.type_id"
            :value="item.type_id"
          >
            {{ item.type_title }}
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
          v-decorator="['incidentAlertSize', { initialValue: record.incidentAlertSize }]"
        />
      </a-form-item>
      <a-form-item
        label="活动周期"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          style="width: 100%"
          v-decorator="['lifeCycleStr', { initialValue:record.lifeCycleStr }]"
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
          v-decorator="['lifeCycleUnit', {
            initialValue: record.lifeCycleUnit
          }]"
          placeholder="请选择"
        >
          <a-select-option value="s">秒</a-select-option>
          <a-select-option value="m">分钟</a-select-option>
          <a-select-option value="h">小时</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="事件描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="['incidentDescription', { initialValue: record.incidentDescription }]"
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
import queryList from '@/api/controller/AlarmqQueryList'
import screening from '@/views/alarm/screening'

export default {
  name: 'AlarmForWard',
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
      levelList: [
        'INFO', 'WARNING', 'MINOR', 'MAJOR', 'CRITICAL'
      ],
      queryList: {}
    }
  },
  created () {
    this.getqueryList()
  },
  methods: {
    async getqueryList () {
      queryList.faultList().then((e) => {
        this.queryList.faultList = e
      })
    },
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep', values)
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
      let list = value
      value.forEach(element => {
        if (element === 'checkall') {
          if (length - 1 === this.levelList && value[length - 1] === 'checkall') {
            list = []
          } else {
            list = []
            this.levelList.forEach(m => {
              list.push(m)
              // const a = this.form.getFieldsValue()
              this.form.setFieldsValue({
                alarmLevel: list
              })
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
