<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="ResourceModelRelationSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    @ok="submit"
    cancelText="取消"
  >
    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'name_s',
                { rules: [{ required: true, message: '名称必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="显示名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'label_s',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="数据权威域"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'domain_s',
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="字典编码"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'valuecode_s',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="字典名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'valuelabel_s',
              ]"
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

const insert = gql`mutation ($objects: [ngecc_instance_values_insert_input!]! = []) {
  insert_ngecc_instance_values (objects: $objects) {
    returning {
      did
    }
  }
}`

const update = gql`mutation update ($where: ngecc_instance_values_bool_exp!, $val: ngecc_instance_values_set_input) {
  update_ngecc_instance_values (
    where: $where,
    _set: $val
  ) {
      returning {
      rid
    }
  }
}`
const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}
export default {
  name: 'ResourceInstanceSchema',
  components: {},
  props: {},
  data: (vm) => ({
    form: vm.$form.createForm(vm),
    formItemLayout,
    loading: false,
    record: null,
    submit: () => {},
    title: '',
    visible: false
  }),
  computed: {},
  methods: {
    add () {
      this.title = '新增'
      this.visible = true
      // this.submit = this.insert
    },
    /**
     * 编辑
     * @param {Object} record
     * @return {Promise<Undefined>}
     */
    async edit (record) {
      this.title = '编辑'
      this.submit = this.update
      this.visible = true
      this.record = {
        ...record
      }
      await this.$nextTick()
      this.form.setFieldsValue(record)
    },
    cancel () {
      this.visible = false
    },
    /**
     * 新增
     */
    async insert () {
      const values = await this.getFormFields()
      this.loading = true
      // FIXME: 数据库 rid 与 did 一致，did 不是外键？
      return apollo.clients.resource.mutate({
        mutation: insert,
        variables: {
          objects: [{
            ...values
          }]
        }
      }).then(res => {
        this.$notification.success({
          message: '系统提示',
          description: '新建成功'
        })
        this.$emit('addSuccess')
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
    async update () {
      const values = await this.getFormFields()
      this.loading = true
      return apollo.clients.resource.mutate({
        mutation: update,
        variables: {
          where: {
            'rid': {
              '_eq': this.record.rid
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
        this.$emit('editSuccess')
        this.cancel()
      }).catch(err => {
        throw err
      }).finally(() => {
        this.loading = false
      })
    },
    async getFormFields () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          err ? reject(err) : resolve(values)
        })
      })
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">

</style>
