/*
 * 故障前转路径管理 关联故障
 */
<template>
  <a-modal
    style="top: 40px;"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="500"
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
        <a-col :lg="24" :md="24" :sm="24">
          <a-form-item label="关联故障">
            <a-select
              allowClear
              style="width: 100%"
              v-decorator="['alarmLevel', {
                initialValue: record.CIType
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
  name: 'FMCorrelation',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      record: '',
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
    async open (record) {
      this.visible = true
      this.record = record
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
