<template>
  <a-modal
    centered
    :confirmLoading="loading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="ResourceInstanceSchema__modal"
    @cancel="cancel"
    :afterClose="reset"
    okText="保存"
    @ok="submit"
    cancelText="取消"
  >
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="基本信息" key="1">
        <a-spin v-show="loading" spinning></a-spin>
        <DynamicForm v-show="!loading" :form="form" :fields="attributes" />
      </a-tab-pane>

      <a-tab-pane tab="关系拓扑图" key="2" forceRender>关系拓扑图</a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { editInstance, addInstance } from '@/api/controller/Instance'
// eslint-disable-next-line no-unused-vars
import { InstanceService, ModelService } from '@/api-hasura/index'
import DynamicForm from '../Utils/DynamicForm'
import _ from 'lodash'
import Timeout from 'await-timeout'

export default {
  name: 'ResourceInstanceSchema',
  components: {
    DynamicForm
  },
  props: {},
  data: (vm) => ({
    form: vm.$form.createForm(vm),
    attributes: [],
    loading: false,
    instance: null,
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
    async loadData (_id) {
      try {
        const { data: { instanceList } } = await InstanceService.find({
          where: {
            _id
          },
          fields: [
            '_id',
            'name',
            'label',
            'values'
          ],
          alias: 'instanceList'
        })
        const [instance] = instanceList
        this.instance = instance
      } catch (e) {
        this.instance = {}
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
     * @param {String} parentName
     * @param {String} _id 实例 id
     * @return {Promise<Undefined>}
     */
    async edit (parentName, _id) {
      this.title = '编辑'
      this.submit = this.update
      this.visible = true
      await Promise.all([
        this.loadAttributes(parentName),
        this.loadData(_id)
      ])
      await this.$nextTick()
      console.log(22)
      const keys = this.attributes.map(attribute => attribute.name)
      await Timeout.set()
      this.form.setFieldsValue(_.pick(this.instance.values, [...keys]))
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
      return editInstance(this.instance.did, value).then(res => {
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
.ResourceInstanceSchema__modal {
  .ant-modal-body {
    padding-top: 0;
    height: 508px;
  }
  .ant-transfer {
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .ant-transfer-operation {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ant-transfer-list {
    height: 400px;
    flex: 1;
  }
}
</style>
