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
            label="名称"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              :disabled="title === '编辑'"
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
                { rules: [{ required: true, message: '显示名称必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="图标"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'icon_s',
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="排序"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              type="number"
              :min="0"
              :max="99"
              v-decorator="[
                'order_i',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="可否编辑"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'edit_b',
                {
                  valuePropName: 'checked'
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :md="12" :span="24">
          <a-form-item
            label="批量操作"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-checkbox
              v-decorator="[
                'batch_b',
                {
                  valuePropName: 'checked'
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :md="12" :span="24">
          <a-form-item
            label="编码"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'encrypt_s',
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
// eslint-disable-next-line
import { editModel, editModelOld, addModels } from '@/api/controller/Resource'

const formItemLayout = {
  labelCol: {
    // span: 6
  },
  wrapperCol: {
    span: 23
  }
}

export default {
  name: 'ResourceTreeNodeSchema',
  components: {},
  data: (vm) => ({
    activeTabKey: '1',
    form: vm.$form.createForm(vm),
    formItemLayout,
    loading: false,
    options: {
      kpi: []
    },
    parentName: '',
    parentTree: '',
    record: null,
    submit: () => {},
    title: '',
    visible: false
  }),
  computed: {},
  methods: {
    /**
     * 新增
     * @param {String} parentName 父节点名称
     * @param {String} parentTree 父节点节点位置
     * @return {Undefined}
     */
    add (parentName, parentTree) {
      this.title = '新增'
      this.visible = true
      this.submit = this.insert
      this.parentName = parentName
      this.parentTree = parentTree
    },
    /**
     * 编辑
     * @param {Object} record
     * @return {Undefined}
     */
    async edit (record) {
      this.title = '编辑'
      this.visible = true
      this.record = {
        ...record
      }
      this.submit = this.update
      await this.$nextTick()
      const keys = Object.keys(this.form.getFieldsValue())
      const formData = {}
      keys.forEach(key => {
        if (record.hasOwnProperty(key)) {
          formData[key] = record[key]
        }
      })
      this.form.setFieldsValue(formData)
    },
    cancel () {
      this.visible = false
    },
    async insert () {
      try {
        const values = await this.getFormFields()
        this.loading = true
        await addModels([{
          ...values,
          parentname_s: this.parentName,
          parenttree_s: this.parentTree
        }])
        this.$notification.success({
          message: '系统提示',
          description: '新建成功'
        })
        this.$emit('addSuccess')
        this.cancel()
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    async update () {
      try {
        await editModelOld()
        const values = await this.getFormFields()
        this.loading = true
        await editModel(this.record.did, values)
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
