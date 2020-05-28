/*
 * 故障类型:详情/编辑/新增
 */
<template>
  <a-modal
    :title="mode=='New'?'新增':mode=='NewSon'?'新增子类型':'编辑'"
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
          <a-form-item label="名称">
            <a-input
              :disabled="mode=='Edit'"
              v-decorator="['type_title', { initialValue: record.type_title, rules: [{ required: true, message: '名称不能为空!' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="父类型">
            <!-- <a-input
              v-decorator="['parent_type_title', { initialValue: record.parent_type_title, rules: [{ required: true, message: '父类型不能为空!' }] }]"
            /> -->
            <a-select
              v-decorator="[
                'parent_type_title',
                { initialValue: record.parent_type_title, rules: [{ required: true, message: '父类型不能为空!' }]}
              ]"
            >
              <a-select-option v-for="item in typeList" :key="item.type_title" >
                {{ item.type_title }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :lg="12" :md="12" :sm="24">
          <a-form-item label="故障描述">
            <a-input
              v-decorator="['comments', { initialValue: record.comments }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <template slot="footer" >
      <a-button @click="handleSubmit">保存</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>

  </a-modal>
</template>

<script>
import screening from '../../screening'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const insert = gql`mutation ($objects: [t_incident_type_insert_input!]! = []) {
  insert_t_incident_type(objects: $objects) {
    returning {
      type_id
    }
  }
}`

const update = gql`mutation update ($where: t_incident_type_bool_exp!, $val: t_incident_type_set_input) {
  update_t_incident_type (
    where: $where,
    _set: $val
  ) {
      returning {
      type_id
    }
  }
}`
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
      typeList: [],
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
    async open (record, mode, typeList) {
      this.visible = true
      if (mode === 'Edit') {
        this.record = record
      } else if (mode === 'NewSon') {
        this.record.parent_type_title = record.parent_type_title
      }
      this.mode = mode
      this.typeList = typeList
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
          values.parent_type_id = values.parent_type_title
          if (this.mode === 'New') {
            values.type_id = screening.createUniqueId()
          }
          this.typeList.find(item => {
            if (item.type_title === values.parent_type_title) {
              values.parent_type_id = item.type_id
            }
          })
          if (this.mode === 'New' | this.mode === 'NewSon') {
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
      return apollo.clients.alert.mutate({
        mutation: insert,
        variables: {
          objects: [{
            ...values
          }]
        }
      }).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '新增成功'
        })
        this.$emit('addSuccess')
        this.handleCancel()
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
      return apollo.clients.alert.mutate({
        mutation: update,
        variables: {
          where: {
            'type_id': {
              '_eq': this.record.type_id
            }
          },
          val: {
            ...values
          }
        }
      }).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '编辑成功'
        })
        this.$emit('addSuccess')
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
