/*
 * 故障前转路径管理 新建/编辑
 */
<template>
  <a-modal
    :title="mode=='New'?'新增':mode=='See'?'详情':'编辑'"
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="900"
    :visible="visible"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <a-form
      id="components-form-demo-validate-other"
      :form="form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="前转路径名称">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['name', { initialValue: record.name, rules: [{ required: true, message: '名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="前转类型">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['forwardType', {
                initialValue: record.forwardType
              }]"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in screening.forwardType"
                :key="item"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="是否启用">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['useing', {
                initialValue: record.status,
                rules: [{ required: true, message: '启用不能为空!' }]
              }]"
              placeholder="请选择"
            >
              <a-select-option value="0">是</a-select-option>
              <a-select-option value="1">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="故障级别">
            <a-select
              allowClear
              :disabled="mode=='See'"
              style="width: 100%"
              v-decorator="['alarmLevel', {
                initialValue: record.CIType,
                rules: [{ required: true, message: '故障级别不能为空!' }]
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
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="消息模板">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['remarks', { initialValue: record.DPFiled, rules: [{ required: true, message: '显示名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <template slot="footer" >
      <a-button v-if="mode!=='See'" @click="handleSubmit">保存</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>

  </a-modal>
</template>

<script>
import screening from '../../screening'
export default {
  name: 'FMDetail',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      record: '',
      // 开启的父级操作来源
      mode: '',
      screening
    }
  },
  beforeCreate () {
  },
  created () {
    window.form = this.form
    // this.form.setFieldsValue(record)
  },
  beforeMount () {
  },
  methods: {
    async open (record, mode) {
      this.visible = true
      this.record = record
      this.mode = mode
      console.log(record, mode)
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    /**
     * 表单效验
     */
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
