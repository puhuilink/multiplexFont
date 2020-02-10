<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="QuotaSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    cancelText="取消"
    @ok="submit"
  >
    <a-form :form="form" layout="vertical">
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="用户名"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              :disabled="title === '编辑'"
              v-decorator="[
                'user_id',
                {
                  rules: [
                    {
                      required: true,
                      message: '用户名必填'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="姓名"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'staff_name',
                {
                  rules: [
                    {
                      required: true,
                      message: '姓名必填'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="岗位职责"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'job_title',
                { rules: [{ required: true, message: '名称必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="办公电话"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'phone',
                { rules: [
                  { required: true, message: '办公电话必填' },
                  {
                    pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$',
                    message: '请输入正确的办公电话'
                  }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="移动电话"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'mobile_phone',
                {
                  rules: [{
                    pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$',
                    message: '请输入正确的移动电话'
                  }]
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="Email"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'email',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Email必填'
                    },
                    {
                      type: 'email',
                      message: '请输入正确的Email'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="备注"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-textarea
              v-decorator="[
                'note',
                {
                  initialValue: ''
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="有效标志"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select
              v-decorator="[
                'flag',
                {
                  initialValue: 1,
                  rules: [
                    {
                      required: true,
                      message: '有效标志必填'
                    }
                  ]
                }
              ]"
            >
              <a-select-option
                v-for="item in options.flag"
                :key="item.value"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

    </a-form>
  </a-modal>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import moment from 'moment'

const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

const insert = gql`mutation insert_user ($objects: [t_user_insert_input!]!) {
  insert_t_user (objects: $objects) {
    returning {
      user_id
    }
  }
}`

const update = gql`mutation update ($where: t_user_bool_exp!, $user: t_user_set_input) {
  update_t_user (
    where: $where,
    _set: $user
  ) {
    returning {
      staff_name
    }
  }
}`

export default {
  name: 'UserSchema',
  components: {},
  props: {},
  data: (vm) => ({
    activeTabKey: '1',
    form: vm.$form.createForm(vm),
    formItemLayout,
    loading: false,
    options: {
      flag: [
        {
          name: '有效',
          value: 1
        },
        {
          name: '无效',
          value: 0
        }
      ]
    },
    record: null,
    submit: () => {},
    title: '',
    visible: false
  }),
  computed: {},
  methods: {
    add () {
      this.title = '新增'
      this.submit = this.insert
      this.visible = true
    },
    /**
       * 编辑
       * @param {Object} record
       * @return {Undefined}
       */
    async edit (record) {
      this.record = {
        ...record
      }
      this.title = '编辑'
      this.submit = this.update
      this.visible = true
      await this.$nextTick()
      this.form.setFieldsValue({
        ...record
      })
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
      return apollo.clients.alert.mutate({
        mutation: insert,
        variables: {
          objects: [{
            ...values,
            // FIXME: 初始值都是DB，还是为空后期配？
            auth_method: 'DB',
            createdate: moment().format('YYYY-MM-DDTHH:mm:ss')
          }]
        }
      }).then(res => {
        this.$emit('createSuccess')
        this.cancel()
      }).catch(err => {
        if (/GraphQL error: Uniqueness violation. duplicate key value/.test(err.message)) {
          //  TODO: toast 已存在的用户名
        }
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
      return apollo.clients.alert.mutate({
        mutation: update,
        variables: {
          where: {
            'user_id': {
              '_eq': this.record.user_id
            }
          },
          user: {
            ...values,
            // FIXME: 初始值都是DB，还是为空后期配？
            auth_method: 'DB',
            updatedate: moment().format('YYYY-MM-DDTHH:mm:ss')
          }
        }
      }).then(res => {
        this.$emit('editSuccess')
        this.cancel()
      }).catch(err => {
        if (/GraphQL error: Uniqueness violation. duplicate key value/.test(err.message)) {
          //  TODO: toast 已存在的用户名
        }
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
