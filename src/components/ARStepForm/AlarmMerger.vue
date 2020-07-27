<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item
        label="告警合并依据"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-checkbox-group
          style="width: 100%;"
          v-decorator="['merge_cells', { initialValue: mergeChoose }]"
        >
          <a-row>
            <a-col :span="8" v-for="(cell,index) in mergeCells" :key="index">
              <a-checkbox :value="cell.option">
                {{ cell.label }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item
        label="最大合并数量"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          v-decorator="['mergeCount', { initialValue: record.mergeCount}]"
        />
      </a-form-item>
      <a-form-item
        label="合并时间窗口"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          addonAfter="秒"
          min="0"
          max="100000"
          v-decorator="['timeWindow', { initialValue: record.timeWindow}]"
        />
      </a-form-item>
      <a-form-item
        label="合并选项"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-checkbox-group
          v-decorator="['update_cells', { initialValue: updateChoose }]"
          style="width: 100%;"
        >
          <a-row>
            <a-col :span="8" v-for="(cell,index) in updateCells" :key="index">
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
  name: 'AlarmMerge',
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
      mergeCells: [
        {
          option: 'mergeNodeId',
          label: '来源节点'
        },
        {
          option: 'mergeAlertCode',
          label: '告警类型'
        },
        {
          option: 'mergeInstance',
          label: '来源实例'
        },
        {
          option: 'mergeInstance2',
          label: '来源实例2'
        },
        {
          option: 'mergeSeverity',
          label: '告警级别'
        },
        {
          option: 'mergeAgentId',
          label: '采集系统'
        },
        {
          option: 'mergeMessage',
          label: '告警内容'
        }
      ],
      updateCells: [
        {
          option: 'updateAlert',
          label: '更新告警内容'
        },
        {
          option: 'autoRecover',
          label: '自动恢复'
        },
        {
          option: 'updateTags',
          label: '更新告警标记'
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
      const defaultUpvalue = []
      this.mergeCells.map(e => {
        if (this.record[e.option] === 'true') {
          defaultValue.push(e.option)
        }
      })
      this.mergeChoose = defaultValue
      this.updateCells.map(e => {
        if (this.record[e.option] === 'true') {
          defaultUpvalue.push(e.option)
        }
      })
      this.updateChoose = defaultUpvalue
    },
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          const re = {}
          that.mergeCells.map(e => {
            if (values['merge_cells'].indexOf(e.option) === -1) {
              re[e.option] = false
            } else {
              re[e.option] = true
            }
          })
          that.updateCells.map(e => {
            if (values['update_cells'].indexOf(e.option) === -1) {
              re[e.option] = false
            } else {
              re[e.option] = true
            }
          })
          values = {
            ...values,
            ...re
          }
          delete (values.merge_cells)
          delete (values.update_cells)
          that.loading = false
          that.$emit('handleSubmit', values)
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
