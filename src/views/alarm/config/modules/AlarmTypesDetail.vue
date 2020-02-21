/*
 * 告警类型:详情/编辑/新建
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
        <a-col :lg="12" :md="12" :sm="24" v-if="mode!=='New'">
          <a-form-item
            label="ID"
          >
            <a-input
              v-model="record.id_s"
              disabled
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="名称">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['name_s', { initialValue: record.name_s, rules: [{ required: true, message: '名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="显示名称">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['label_s', { initialValue: record.label_s, rules: [{ required: true, message: '显示名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="图标">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['icon_s', { initialValue: record.icon_s?record.icon_s:'AlertType' }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="描述">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['description_1_s', { initialValue: record.description_1_s }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="启用">
            <a-select
              :disabled="mode=='See'"
              v-decorator="[
                'enable_b',
                { initialValue: record.enable_b?record.enable_b+'':'true'},
              ]"
            >
              <a-select-option value="true">
                是
              </a-select-option>
              <a-select-option value="false">
                否
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="所属节点类型">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['nodetype_s', { initialValue: record.nodetype_s?record.nodetype_s:'CommonCi' }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="告警编码">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['alarmCode', { initialValue: record.alarmCode }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="更新时间">
            <a-date-picker
              showTime
              style="width: 100%"
              :disabled="mode=='See'"
              v-decorator="['updatetime_t', { initialValue: record.updatetime_t }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="数据权限域">
            <a-input
              :disabled="mode=='See'"
              v-decorator="['domain_s', { initialValue: record.domain_s?record.domain_s:'rootDomain' }]"
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
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const insert = gql`mutation ($objects: [ngecc_instance_values_insert_input!]! = []) {
  insert_ngecc_instance_values (objects: $objects) {
    returning {
      rid
    }
  }
}`

const update = gql`mutation update ($where: ngecc_instance_values_bool_exp!, $val: ngecc_instance_values_set_input) {
  update_ngecc_instance_values (
    where: $where,
    _set: $val
  ) {
      returning {
      id_s
    }
  }
}`
export default {
  name: 'AlarmTypesDetail',
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
      this.mode = mode
      this.record = { ...record }
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
          // 告警编码先置空
          delete values.alarmCode
          values.enable_b === 'true' ? values.enable_b = true : values.enable_b = false
          if (this.mode === 'New') {
            this.insert(values)
          } else if (this.mode === 'Edit') {
            this.update(values)
          }
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
    },
    /**
     * 新增
     */
    async insert (values) {
      this.loading = true
      // FIXME: 数据库 rid 与 did 一致，did 不是外键？
      return apollo.clients.resource.mutate({
        mutation: insert,
        variables: {
          objects: [{
            ...values,
            parentname_s: 'Alert'
          }]
        }
      }).then(res => {
        // this.$emit('addSuccess')
        this.cancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 编辑
     */
    async update (values) {
      this.loading = true
      return apollo.clients.resource.mutate({
        mutation: update,
        variables: {
          where: {
            'id_s': {
              '_eq': this.record.id_s
            }
          },
          val: {
            ...values
          }
        }
      }).then(res => {
        // this.$emit('editSuccess')
        console.log('编辑成功')
        this.handleCancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
