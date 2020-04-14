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
          placeholder="请选择告警类型"
          v-decorator="[
            'newAlertCode',
            {
              initialValue: record.newAlertCode
            }
          ]"
        >
          <a-select-opt-group
            v-for="(group,index) in queryList.alertList"
            :key="index"
            :label="group[0].parentname_s"
            :allowClear="true"
          >
            <template v-for="groupitem in group">
              <a-select-option :value="groupitem.id_s" :key="groupitem.id_s">{{ groupitem.label_s }}</a-select-option>
            </template>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <a-form-item
        label="新的告警级别"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          mode="multiple"
          allowClear
          placeholder="请选择告警级别"
          v-decorator="[
            'newSeverity',
            {
              initialValue: record.newSeverity
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
        label="新的告警标记"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group
          name="radioGroup"
          v-decorator="['tagOp', {
            initialValue: record.tagOp}
          ]"
        >
          <a-radio value="0">添加</a-radio>
          <a-radio value="1">重置</a-radio>
          <a-radio value="2">删除</a-radio>
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
            'newTags',
            {initialValue: record.newTags}
          ]"
          @change="alarmLevelChange"
        >
          <!-- <a-select-option value="checkall" key="checkall">全选</a-select-option> -->
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
import queryList from '@/api/controller/AlarmqQueryList'

export default {
  name: 'AlarmClassify',
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
      queryList.alertList().then((e) => {
        this.queryList.alertList = e
      })
    },
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          console.log('表单 values', values)
          that.timer = setTimeout(function () {
            that.loading = false
            that.$emit('handleSubmit', values)
          }, 1500)
        } else {
          that.loading = false
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
