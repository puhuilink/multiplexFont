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
    cancelText="取消"
    @ok="submit"
  >
    <a-form
      :form="form"
      layout="vertical"
    >
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
                {
                  rules: [{ required: true, message: '显示名称必填' }],
                  // initialValue: 'name'
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="目标"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'target_s',
                { rules: [{ required: true, message: '目标必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="映射类型"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select
              v-decorator="[
                'mappingtype_s',
                {
                  initialValue: 'one'
                },
              ]"
            >
              <a-select-option
                v-for="item in options.map"
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
            label="关系类型"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select
              v-decorator="[
                'relationtype_s',
                {
                  initialValue: 'Belongs To'
                },
              ]"
            >
              <a-select-option
                v-for="item in options.relationType"
                :key="item.value"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="所属分组"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select
              v-decorator="[
                'tabgroup_s',
                {
                  initialValue: '基本信息'
                },
              ]"
            >
              <a-select-option
                v-for="item in options.group"
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
            label="排序"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              type="number"
              v-decorator="[
                'order_i',
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="是否继承"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'allowinheritance_b',
                {
                  valuePropName: 'checked'
                }
              ]"></a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="是否作为查询框"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'searchfield_b',
                {
                  valuePropName: 'checked'
                }
              ]"></a-checkbox>
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <!-- FIXME: VICUBE 此处为空？ -->
          <a-form-item
            label="匹配条件"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select>
              <a-select-option
                v-for="item in []"
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
            label="非空"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'allownull_b',
                {
                  valuePropName: 'checked'
                }
              ]"></a-checkbox>
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="资产属性"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'assetattr_b',
                {
                  valuePropName: 'checked'
                }
              ]"></a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="默认值"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'defaultvalue_s',
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

const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

const options = {
  type: [
    {
      name: 'STRING',
      value: 'STRING'
    },
    {
      name: 'INT',
      value: 'INT'
    },
    {
      name: 'DOUBLE',
      value: 'DOUBLE'
    },
    {
      name: 'LONG',
      value: 'LONG'
    },
    {
      name: 'DATE',
      value: 'DATE'
    }
  ],
  displayType: [
    {
      name: 'TEXT',
      value: 'TEXT'
    },
    {
      name: 'TEXTAREA',
      value: 'TEXTAREA'
    },
    {
      name: 'DATE',
      value: 'DATE'
    },
    {
      name: 'DATETIME',
      value: 'DATETIME'
    },
    {
      name: 'CHECKBOX',
      value: 'CHECKBOX'
    }
  ],
  map: [
    {
      name: 'one',
      value: 'one'
    },
    {
      name: 'more',
      value: 'more'
    }
  ],
  relationType: [
    {
      name: 'Belongs To',
      value: 'Belongs To'
    },
    {
      name: 'Installed On',
      value: 'Installed On'
    },
    {
      name: 'Located in',
      value: 'Located in'
    },
    {
      name: 'Related To',
      value: 'Related To'
    },
    {
      name: 'Connected To',
      value: 'Connected To'
    },
    {
      name: 'Pointed To',
      value: 'Pointed To'
    },
    {
      name: '交易路径下一环节',
      value: '交易路径下一环节'
    },
    {
      name: '位置归属于',
      value: '位置归属于'
    }
  ],
  group: [
    {
      name: '基本信息',
      value: 'base'
    },
    {
      name: '关系信息',
      value: 'relation'
    },
    {
      name: '其他信息',
      value: 'other'
    }
  ]
}

const insert = gql`mutation insert_relationattribute ($objects: [ngecc_relationattribute_insert_input!]! = []) {
  insert_ngecc_relationattribute (objects: $objects) {
    affected_rows
  }
}`

const update = gql`mutation update_relationattribute($did: Int!, $object: ngecc_relationattribute_set_input) {
  update_ngecc_relationattribute(
    where: {
      did:
        {_eq: $did}
      }
    _set: $object
  ) {
    affected_rows
  }
}
`

export default {
  name: 'ResourceModelRelationSchema',
  components: {},
  props: {},
  data: (vm) => ({
    sourceS: null,
    form: vm.$form.createForm(vm),
    formItemLayout,
    loading: false,
    options,
    record: null,
    submit: () => {},
    title: '',
    visible: false
  }),
  computed: {},
  methods: {
    /**
     * 新增
     * @param {String} sourceS 关联
     */
    add (sourceS) {
      this.title = '新增'
      this.visible = true
      this.sourceS = sourceS
      this.submit = this.insert
    },
    /**
       * 编辑
       * @param {Object} record
       * @return {Undefined}
       */
    async edit (record) {
      this.title = '编辑'
      this.visible = true
      this.submit = this.update
      this.record = {
        ...record
      }
      await this.$nextTick()
      // FIXME: checkbox
      this.form.setFieldsValue(record)
    },
    cancel () {
      this.visible = false
    },
    async insert () {
      try {
        this.loading = true
        const value = await this.getFormFields()
        await apollo.clients.resource.mutate({
          mutation: insert,
          variables: {
            objects: [
              {
                ...value,
                'source_s': this.sourceS
              }
            ]
          }
        })
        // TODO: toast
        this.$emit('addSuccess')
        this.cancel()
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    // FIXME: 所有表单长度校验。。。
    async update () {
      try {
        this.loading = true
        const value = await this.getFormFields()
        await apollo.clients.resource.mutate({
          mutation: update,
          variables: {
            did: this.record.did,
            object: {
              ...value
            }
          }
        })
        // TODO: toast
        this.$emit('editSuccess')
        this.cancel()
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
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
  .ResourceModelRelationSchema {
    &__modal {
      .ant-modal-body {
        height: 415px;
        overflow: scroll;
      }
    }
  }
</style>
