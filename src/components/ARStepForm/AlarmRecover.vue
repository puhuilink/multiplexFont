/*
 * 告警恢复规则
 */
<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="恢复时间门限"
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
        label="恢复"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-checkbox-group
          v-decorator="['recover_cells', { initialValue: recoverChoose }]"
          style="width: 100%;"
        >
          <a-row>
            <a-col :span="8" v-for="(cell,index) in recoverCells" :key="index">
              <a-checkbox :value="cell.option">
                {{ cell.label }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
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
  name: 'AlarmRecover',
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
      // timer: 0,
      recoverCells: [
        {
          option: 'resolved',
          label: '设置为忽略'
        },
        {
          option: 'clearOut',
          label: '清出内存'
        }
      ],
      mergeChoose: [],
      updateChoose: []
    }
  },
  created () {
    this.getDefaultValue()
  },
  methods: {
    getDefaultValue () {
      const defaultValue = []
      this.recoverCells.map(e => {
        if (this.record[e.option] === 'true') {
          defaultValue.push(e.option)
        }
      })
      this.recoverChoose = defaultValue
    },
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          const re = {}
          that.recoverCells.map(e => {
            if (values['recover_cells'].indexOf(e.option) === -1) {
              re[e.option] = false
            } else {
              re[e.option] = true
            }
          })
          values = {
            ...values,
            ...re
          }
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
  }
  // beforeDestroy () {
  //   clearTimeout(this.timer)
  // }
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
