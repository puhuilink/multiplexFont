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
    @cancel="cancel"
    @ok="submit"
  >
    <a-form
      id="components-form-demo-validate-other"
      :form="form"
      layout="vertical"
      @submit="submit"
    >
      <a-row class="form-row" :gutter="16">
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="策略名称">
            <a-input
              v-decorator="['title', { rules: [{ required: true, message: '策略名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="周期值">
            <a-input
              :disabled="mode=='cycle_count'"
              type="number"
              v-decorator="['cycle_count', { rules: [{ required: true, message: '不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="时间步长（分钟）">
            <a-input
              :disabled="mode=='See'"
              placeholder="计算间隔：数字类型，单位为“分钟”,必须要被60整除"
              type="number"
              v-decorator="['cal_interval', {
                rules: [
                  { required: true, message: '不能为空!' },
                  { validator }
                ] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="样本密集区域">
            <a-input
              :disabled="mode=='See'"
              placeholder="取样数据区域，数字类型，0-1"
              type="number"
              :min="0"
              :max="1"
              v-decorator="['sample_radio', { rules: [{ required: true, message: '不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="计算时间">
            <a-input
              :disabled="mode=='See'"
              placeholder="cron表达式，例：0 50 ***?"
              v-decorator="['cron_expression', { rules: [{ required: true, message: '不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="±σ">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['sigma', { rules: [{ required: true, message: '±σ不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

  </a-modal>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

// FIXME: uuid ?
const insert = gql`mutation insert_baseline_policy ($objects: [t_baseline_policy_insert_input!]! = []) {
  insert_t_baseline_policy (objects: $objects) {
    affected_rows
  }
}`

const update = gql`mutation update_baseline_policy($uuid: String, $object: t_baseline_policy_set_input) {
  update_t_baseline_policy(where: {uuid: {_eq: $uuid}}, _set: $object) {
    affected_rows
  }
}
`

export default {
  name: 'FTDetail',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      record: '',
      // 开启的父级操作来源
      mode: '',
      submit: () => {}
    }
  },
  methods: {
    validator (rule, value, callback) {
      if (60 % Number(value) !== 0) {
        // eslint-disable-next-line
        callback('不能被60整除')
      } else {
        callback()
      }
    },
    /**
     * 新增 / 编辑
     * @param {Object} record 编辑时的源数据
     * @mode {'Edit' | 'Add' | 'See'} mode 操作模式
     */
    async open (record = {}, mode) {
      this.visible = true
      if (mode === 'Edit') {
        this.submit = this.update
        this.record = {
          ...record
        }
        await this.$nextTick()
        this.form.setFieldsValue(record)
      } else if (mode === 'See') {
        this.submit = this.insert
      }
      this.mode = mode
    },
    async getFormFields () {
      return new Promise((resolve, reject) => {
        this.form.validateFieldsAndScroll((err, values) => {
          err ? reject(err) : resolve(values)
        })
      })
    },
    cancel (e) {
      this.visible = false
    },
    /**
     * 更新
     */
    async update () {
      try {
        this.loading = true
        const value = await this.getFormFields()
        await apollo.clients.alert.mutate({
          mutation: update,
          variables: {
            uuid: this.record.uuid,
            object: value
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: '编辑成功'
        })
        this.$emit('editSuccess')
        this.cancel()
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    /**
     * 新增
     */
    async insert () {
      try {
        this.loading = true
        // const value = await this.getFormFields()
        await apollo.clients.alert.mutate({
          mutation: insert,
          variables: {

          }
        })
        this.$emit('addSuccess')
        this.cancel()
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
