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
              :disabled="title === '编辑'"
              v-decorator="[
                'name',
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
                'label',
                {
                  rules: [{ required: true, message: '显示名称必填' }],
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
            <!-- TODO: 接受值 -->
            <a-select
              showSearch
              allowClear
              style="min-width: 200px"
              :notFoundContent="targetLoading ? '加载中...' : '暂无数据'"
              :filterOption="filterOption"
              v-decorator="[
                'target',
                { rules: [{ required: true, message: '目标必填' }] },
              ]"
            >
              <a-select-opt-group v-for="(target, idx) in targetList" :key="idx">
                <span slot="label">{{ target.label }}</span>
                <a-select-option
                  v-for="(item, itemIdx) in target.children"
                  :key="`${itemIdx}-${item.label}`"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select-opt-group>
            </a-select>
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
                'mappingType',
                {
                  rules: [
                    {
                      required: true,
                      message: '所属分组必填'
                    }
                  ],
                  initialValue: 'one'
                },
              ]"
            >
              <a-select-option
                v-for="item in options.mappingType"
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
                'relationType',
                {
                  rules: [
                    {
                      required: true,
                      message: '所属分组必填'
                    }
                  ],
                  initialValue: 'BelongsTo'
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
                'tabGroup',
                {
                  rules: [
                    {
                      required: true,
                      message: '所属分组必填'
                    }
                  ],
                  initialValue: 'base'
                },
              ]"
            >
              <a-select-option
                v-for="item in options.tabGroup"
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
                'order',
                {
                  initialValue: 0
                }
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
                'allowInheritance',
                {
                  valuePropName: 'checked',
                  initialValue: false
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
                'searchField',
                {
                  valuePropName: 'checked',
                  initialValue: false
                }
              ]"></a-checkbox>
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="匹配条件"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-select>
              <a-select-option
                v-for="item in options.matchType"
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
                'allowNull',
                {
                  valuePropName: 'checked',
                  initialValue: false
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
                'assetsAttr',
                {
                  valuePropName: 'checked',
                  initialValue: false
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
                'defaultValue',
                {
                  initialValue: ''
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { CiModelSelect } from '@/components/Common/index'
import { ModelService, RelationAttributeService } from '@/api-hasura/index'

const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

const options = {
  mappingType: [
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
      value: 'LocationBelongsTo'
    },
    {
      name: 'Installed On',
      value: 'InstalledOn'
    },
    {
      name: 'Located in',
      value: 'LocatedIn'
    },
    {
      name: 'Related To',
      value: 'RelatedTo'
    },
    {
      name: 'Connected To',
      value: 'ConnectedTo'
    },
    {
      name: 'Pointed To',
      value: 'PointedTo'
    },
    {
      name: '交易路径下一环节',
      // TODO: 待定
      value: '交易路径下一环节'
    },
    {
      name: '位置归属于',
      // TODO: 待定
      value: '位置归属于'
    }
  ],
  tabGroup: [
    {
      name: '基本信息',
      value: 'base'
    },
    {
      name: '关系信息',
      value: 'relation'
    },
    {
      // TODO: 待定
      name: '其他信息',
      value: 'other'
    }
  ],
  matchType: [
    {
      name: '等于',
      value: 'EQ'
    },
    {
      name: '模糊',
      value: 'LIKE'
    }
  ]
}

export default {
  name: 'ResourceModelRelationSchema',
  components: {
    CiModelSelect
  },
  props: {},
  data: (vm) => ({
    source: null,
    form: vm.$form.createForm(vm),
    formItemLayout,
    loading: false,
    targetLoading: false,
    targetList: [],
    options,
    record: null,
    submit: () => {},
    title: '',
    visible: false
  }),
  computed: {},
  methods: {
    filterOption (input, option) {
      const text = option.componentOptions.children[0].text || ''
      return text.toLowerCase().includes(
        input.toLowerCase()
      )
    },
    async loadTarget () {
      try {
        this.targetLoading = true
        const { data: { targetList } } = await ModelService.find({
          fields: [
            'label',
            'value: name',
            `children {
              label
              value: name
              parentName
            }`
          ],
          'alias': 'targetList'
        })
        // const { targetList } = await getModelList(true)
        this.targetList = targetList
      } catch (e) {
        this.targetList = []
        throw e
      } finally {
        this.targetLoading = false
      }
    },
    /**
     * 新增
     * @param {String} source 关联
     */
    add (source) {
      this.title = '新增'
      this.visible = true
      this.source = source
      this.submit = this.insert
      this.loadTarget()
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
      this.loadTarget()
      // FIXME: checkbox
      this.form.setFieldsValue(record)
    },
    cancel () {
      this.visible = false
    },
    async insert () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.loading = true
          await RelationAttributeService.add({
            ...values,
            source: this.source
          })
          this.$notification.success({
            message: '系统提示',
            description: '新增成功'
          })
          this.$emit('addSuccess')
          this.cancel()
        } catch (e) {
          this.$notification.error({
            message: '系统提示',
            description: h => h('p', { domProps: { innerHTML: e } })
          })
          throw e
        } finally {
          this.loading = false
        }
      })
    },
    // FIXME: 所有表单长度校验。。。
    async update () {
      this.form.validateFields(async (err, values) => {
        if (err) return
        try {
          this.loading = true
          await RelationAttributeService.update(
            values,
            { _id: this.record._id }
          )
          this.$notification.success({
            message: '系统提示',
            description: '编辑成功'
          })
          this.$emit('addSuccess')
          this.cancel()
        } catch (e) {
          this.$notification.error({
            message: '系统提示',
            description: h => h('p', { domProps: { innerHTML: e } })
          })
          throw e
        } finally {
          this.loading = false
        }
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
