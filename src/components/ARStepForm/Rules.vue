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
          placeholder="请选择告警类型"
          v-decorator="[
            'alarmType',
            { rules: [{ required: true, message: '请选择告警类型' }] },
          ]"
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
      <a-form-item
        label="告警级别"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select
          mode="multiple"
          allowClear
          placeholder="请选择告警级别"
          v-decorator="[
            'alarmLevel',
            { rules: [{ required: true, message: '请选择告警级别' }] },
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
        <a-button style="margin-left: 8px" type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import screening from '@/views/alarm/screening'
export default {
  name: 'Rules',
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
