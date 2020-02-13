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
            label="工作组名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'group_name',
                {
                  rules: [
                    {
                      required: true,
                      message: '工作组名称必填'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :span="24">
          <a-form-item
            label="工作组编号"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              :disabled="title === '编辑'"
              v-decorator="[
                'group_id',
                {
                  rules: [
                    {
                      required: true,
                      message: '工作组编号必填'
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
        <a-col :md="12" :span="24">
          <a-form-item
            label="域"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select
              allowClear
              v-decorator="[
                'domain',
                {
                  rules: [
                    {
                      // required: true,
                      // message: '域必填'
                    }
                  ]
                }
              ]"
            >
              <a-select-option
                v-for="item in options.domain"
                :key="item.value"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
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
                'username',
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
import moment from 'moment'

const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

const insert = gql`mutation ($objects: [t_group_insert_input!]!) {
  insert_t_group (objects: $objects) {
    returning {
      group_id
    }
  }
}`

const update = gql`mutation update ($where: t_group_bool_exp!, $group: t_group_set_input) {
  update_t_group (
    where: $where,
    _set: $group
  ) {
    returning {
      group_id
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
      ],
      domain: [
        {
          name: 'rootDomain',
          value: 'rootDomain'
        },
        {
          name: '北京运维组',
          value: 'bjDomain'
        },
        {
          name: '厦门运维组',
          value: 'xmDomain'
        },
        {
          name: '置空',
          value: null
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
      this.visible = true
      this.submit = this.insert
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
    async getFormFields () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          err ? reject(err) : resolve(values)
        })
      })
    },
    cancel () {
      this.visible = false
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
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
            createdate: moment().format('YYYY-MM-DDTHH:mm:ss')
          }]
        }
      }).then(res => {
        this.$emit('addSuccess')
        this.cancel()
      }).catch(err => {
        if (/GraphQL error: Uniqueness violation. duplicate key value/.test(err.message)) {
          //  TODO: toast 已存在的工作组编号
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
            'group_id': {
              '_eq': this.record.group_id
            }
          },
          group: {
            ...values,
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
    }
  }
}
</script>

<style lang="less">
</style>
