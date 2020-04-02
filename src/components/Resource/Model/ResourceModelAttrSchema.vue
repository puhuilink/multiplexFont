<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="ResourceModelAttrSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    @ok="submit"
    cancelText="取消"
  >
    <a-form
      :form="form"
      layout="vertical"
    >
      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="显示名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'label_s',
                { rules: [{ required: true, message: '显示名称必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="属性名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              :disabled="title === '编辑'"
              v-decorator="[
                'name_s',
                {
                  rules: [{ required: true, message: '' }],
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
            label="显示宽度"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'width_i'
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="数据类型"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select
              v-decorator="[
                'datatype_s',
                {
                  initialValue: 'STRING'
                },
              ]"
            >
              <a-select-option
                v-for="item in options.type"
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
            label="显示类型"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select
              v-decorator="[
                'displaytype_s',
                {
                  initialValue: 'TEXT',
                  rules: [
                    {
                      required: true,
                      message: '显示类型必选'
                    }
                  ]
                },
              ]"
            >
              <a-select-option
                v-for="item in options.displayType"
                :key="item.value"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="源类型"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select
              v-decorator="[
                'sourcetype_s',
              ]"
            >
              <a-select-option
                v-for="item in options.sourcetype"
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
            label="作为查询"
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
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="匹配条件"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'matchtype_s'
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="源值"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'sourcevalue_s',
              ]">
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="继承"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'allowinheritance_b',
                {
                  valuePropName: 'checked'
                }
              ]">
            </a-checkbox>
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="隐藏"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'hidden_b',
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
            label="不可编辑"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'edit_b',
                {
                  valuePropName: 'checked'
                }
              ]"></a-checkbox>
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
                'tabgroup_s'
              ]"
            >
              <a-select-option
                v-for="item in options.tabgroup"
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
            label="默认值"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'defaultvalue_s'
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="运算值"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'operationvalue_s'
              ]"
            />
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
            <!-- TODO: >= 0 ?-->
            <a-input
              type="number"
              v-decorator="[
                'order_i'
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="唯一验证"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'uniqueness_b',
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
            label="唯一范围"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <!-- TODO: >= 0 ? 格式可否为小数？数据库里精确到小数点后一位-->
            <a-input
              type="number"
              v-decorator="[
                'uniquenessscope_s'
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="正则验证"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'pattern_s'
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="提示信息"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'alertmessage_s'
              ]"
            />
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
                'assetsattr_b',
                {
                  valuePropName: 'checked'
                }
              ]"></a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { addModelAttr, updateModelAttr } from '@/api/controller/ModelAttr'

const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

const options = {
  // FIXME: 值从哪里来？
  sourcetype: [],
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
    },
    {
      name: 'BOOLEAN',
      value: 'BOOLEAN'
    },
    {
      name: 'FLOAT',
      value: 'FLOAT'
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
    },
    {
      name: 'DATETIME',
      value: 'DATETIME'
    },
    {
      name: 'CHECKBOX',
      value: 'CHECKBOX'
    },
    {
      name: 'RADIO',
      value: 'RADIO'
    },
    {
      name: 'SELECTED',
      value: 'SELECTED'
    },
    {
      name: 'URMPTREE',
      value: 'URMPTREE'
    }
  ],
  tabgroup: [
    {
      name: '基本关系',
      value: 'base'
    }
    // TODO: 找出剩余两种关系的值
    // {
    //   name: '关系信息',
    //   value: '?'
    // },
    // {
    //   name: '其他信息',
    //   value: '??'
    // }
  ]
}

export default {
  name: 'ResourceModelAttrSchema',
  components: {},
  props: {
    did: {
      type: Number,
      required: true
    }
  },
  data: (vm) => ({
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
    add () {
      this.title = '新增'
      this.submit = this.insert
      this.visible = true
    },
    /**
       * 编辑
       * @param {Object} record
       * @return {Promise<Undefined>}
       */
    async edit (record) {
      this.title = '编辑'
      this.submit = this.update
      this.record = {
        ...record
      }
      this.visible = true
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
      const value = {
        ...await this.getFormFields(),
        did: this.did
      }
      this.loading = true
      return addModelAttr(value).then(res => {
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
      const value = await this.getFormFields()
      this.loading = true
      return updateModelAttr(this.record.rid, value)
        .then(res => {
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
  .ResourceModelAttrSchema {
    &__modal {
      .ant-modal-body {
        height: 415px;
        overflow: scroll;
      }
    }
  }
</style>
