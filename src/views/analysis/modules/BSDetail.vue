/*
 * 动态基线策略管理 编辑/新建
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
          <a-form-item label="策略名称">
            <a-input
              v-decorator="['name', { initialValue: record.name, rules: [{ required: true, message: '策略名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="周期值">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['father', { initialValue: record.father, rules: [{ required: true, message: '不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="时间步长（分钟）">
            <a-input
              :disabled="mode=='See'"
              placeholder="计算间隔：数字类型，单位为“分钟”,必须要被1小时整除"
              v-decorator="['describe', { initialValue: record.describe, rules: [{ required: true, message: '不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="样本密集区域">
            <a-input
              :disabled="mode=='See'"
              placeholder="取样数据区域，数字类型，0-1"
              v-decorator="['describe', { initialValue: record.describe, rules: [{ required: true, message: '不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="触发时间">
            <a-input
              :disabled="mode=='See'"
              placeholder="cron表达式，例：0 50 ***?"
              v-decorator="['describe', { initialValue: record.describe, rules: [{ required: true, message: '不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="±σ">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['describe', { initialValue: record.describe, rules: [{ required: true, message: '±σ不能为空!' }] }]"
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
export default {
  name: 'FTDetail',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      record: '',
      // 开启的父级操作来源
      mode: ''
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
      console.log(record, mode)
      this.mode = mode
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
    },
    /**
     * tab切换开关
     */
    onTabChange (key, type) {
      this.autoRefresh = false
      clearInterval(this.timer)
      this[type] = key
    }
  }
}
</script>

<style lang="less" scoped>
</style>
