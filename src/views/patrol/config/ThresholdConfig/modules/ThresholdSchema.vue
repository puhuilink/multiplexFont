<template>
  <a-modal
    :title="modalTitle"
    wrapClassName="HostSchema"
    :visible="visible"
    @ok="handleOk"
    @cancel="closeModal"
    @close="closeModal"
  >

    <a-form-model
      :model="editForm"
      ref="ruleForm"
      :rules="rules"
    >
      <a-form-model-item label="阈值类型" ref="condition" prop="condition">
        <a-select
          v-model="editForm.condition">
          <a-select-option :value="'eq'">等于</a-select-option>
          <a-select-option :value="'ne'">不等于</a-select-option>
          <a-select-option v-show="isFill" :value="'gt'">大于</a-select-option>
          <a-select-option v-show="isFill" :value="'lt'">小于</a-select-option>
          <a-select-option v-show="isFill" :value="'out'">超过</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="阈值数值"
        ref="threshold"
        prop="lowerThreshold"
        v-if="this.isLowThresholdInput||this.isLowThresholdSelect">
        <a-input-number
          :style="{width:'100%'}"
          v-if="isLowThresholdInput"
          v-model="editForm.lowerThreshold"
          placeholder="请输入告警最小值"
        >
        </a-input-number>
        <a-select
          v-if="isLowThresholdSelect"
          v-model="editForm.lowerThreshold">
          <a-select-option v-for="option in this.answerFormat" :key="option.value" :value="option.value">{{ option.alias }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="阈值数值"
        prop="upperThreshold"
        v-if="isUpThreshold"
      >
        <a-input-number
          :style="{width:'100%'}"
          placeholder="请输入告警最大值"
          v-model="editForm.upperThreshold">
        </a-input-number>
      </a-form-model-item>
      <a-form-model-item label="告警等级" ref="severity" prop="severity">
        <a-select
          v-model="editForm.severity">
          <a-select-option :value="'1'">L1</a-select-option>
          <a-select-option :value="'2'">L2</a-select-option>
          <a-select-option :value="'3'">L3</a-select-option>
          <a-select-option :value="'4'">L4</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>

import { xungeng } from '@/utils/request'

export default {
  name: 'ThresholdSchema',
  components: {},
  props: {},
  data () {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
    return {
      visible: false,
      parentData: {},
      editForm: {
        id: '',
        condition: '',
        lowerThreshold: '',
        upperThreshold: '',
        severity: ''
      },
      handleOk: () => {},
      formItemLayout,
      modalTitle: '编辑阈值规则',
      fetching: false,
      rules: {
        condition: [{ required: true, message: '阈值条件不能为空！', trigger: 'change' }],
        severity: [{ required: true, message: '阈值等级不能为空！', trigger: 'change' }],
        lowerThreshold: [{ required: true, message: '阈值数值不能为空！', trigger: 'change' },
          { pattern: /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/, message: '必须填写数字！', trigger: 'change' },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.editForm.condition === 'out' && this.editForm.upperThreshold && this.editForm.upperThreshold < value) {
                callback(new Error('不能超过最大值'))
              } else {
                callback()
              }
            },
            trigger: 'change' }
        ],
        upperThreshold: [{ required: true, message: '阈值数值不能为空！', trigger: 'change' },
          { pattern: /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/, message: '必须填写数字！', trigger: 'change' },
          { required: true,
            validator: (rule, value, callback) => {
              if (this.editForm.condition === 'out' && this.editForm.lowerThreshold && this.editForm.lowerThreshold > value) {
                callback(new Error('不能低于最小值'))
              } else {
                callback()
              }
            },
            trigger: 'change' }
        ]
      }
    }
  },
  created () {
  },

  mounted () {},
  computed: {
    isFill: {
      get () {
        return this.parentData.answerType === 'fill'
      }
    },
    isLowThresholdInput: {
      get () {
        return this.parentData.answerType === 'fill' &&
          (this.editForm.condition === 'lt' ||
            this.editForm.condition === 'eq' ||
            this.editForm.condition === 'ne' ||
            this.editForm.condition === 'in' ||
            this.editForm.condition === 'out')
      }
    },
    isLowThresholdSelect: {
      get () {
        return this.parentData.answerType === 'select'
      }
    },
    isUpThreshold: {
      get () {
        return this.parentData.answerType === 'fill' && this.editForm.condition !== 'lt' && this.editForm.condition !== 'eq' && this.editForm.condition !== 'ne'
      }
    },
    answerFormat: {
      get () {
        const { answerFormat } = this.parentData
        return JSON
          .parse(answerFormat)
      }
    }
  },
  methods: {
    openModal (data) {
      this.parentData = data
      const { id, condition, lowerThreshold, upperThreshold, severity } = data
      Object.assign(this.editForm, { id, condition, lowerThreshold, upperThreshold, severity: severity.toString() })
      this.visible = true
      this.handleOk = this.update
    },
    update () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const result = await xungeng.post('/threshold/edit', this.editForm)
        if (result.code === 200) {
          this.$notification.success({
            message: '系统提示',
            description: '阈值编辑成功'
          })
          this.closeModal()
          this.$emit('refresh')
        } else {
          this.$notification.error({
            message: '系统提示',
            description: '操作失败：' + result.msg.toString()
          })
        }
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    closeModal () {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
