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
    <a-spin v-if="loading" spinning></a-spin>
    <DynamicForm v-else :form="form" :fields="attributes" />
  </a-modal>
</template>

<script>
import { editInstance, addInstance } from '@/api/controller/Instance'
// eslint-disable-next-line no-unused-vars
import { InstanceService, ModelService } from '@/api-hasura/index'
import DynamicForm from '../Utils/DynamicForm'
import _ from 'lodash'

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
  components: {
    DynamicForm
  },
  props: {},
  data: (vm) => ({
    form: vm.$form.createForm(vm),
    formItemLayout,
    attributes: [],
    loading: false,
    record: null,
    submit: () => {},
    title: '',
    visible: false
  }),
  computed: {},
  methods: {
    async loadAttributes (parentName, parentTree) {
      try {
        this.loading = true
        const { data: { modelList } } = await ModelService.find({
          where: {
            name: parentName
          },
          fields: [
            'attributes'
          ],
          alias: 'modelList'
        })
        // name 是唯一字段，查询出的 model 是长度为1的数组
        const [model] = modelList
        const { attributes } = model
        this.attributes = _.orderBy(attributes, ['orderBy'], ['asc'])
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    add (parentName, parentTree) {
      this.title = '新增'
      this.visible = true
      this.submit = this.insert
      this.parentName = parentName
      this.parentTree = parentTree
      this.loadAttributes(parentName)
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
      this.loadAttributes()
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
      let value = await this.getFormFields()
      value = {
        ...value,
        'parentname_s': this.parentName,
        'parenttree_s': this.parentTree
      }
      this.loading = true
      return addInstance(value).then(res => {
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
      return editInstance(this.record.did, value).then(res => {
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
