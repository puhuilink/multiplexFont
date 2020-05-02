<template>
  <a-modal
    centered
    destroyOnClose
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
    <a-spin :spinning="loading">
      <a-tabs defaultActiveKey="1">

        <a-tab-pane tab="基本信息" key="1">
          <DynamicForm :form="attributesForm" :fields="attributes" />
        </a-tab-pane>

        <a-tab-pane tab="关系拓扑图" key="2" forceRender>关系拓扑图</a-tab-pane>

        <a-tab-pane tab="关系信息" key="3" forceRender v-if="relationAttributeList.length">
          <DynamicForm :form="relationAttributeListForm" :fields="relationAttributeList" />
        </a-tab-pane>

      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
import { editInstance, addInstance } from '@/api/controller/Instance'
// eslint-disable-next-line no-unused-vars
import { InstanceService, ModelService, RelationAttributeService } from '@/api-hasura/index'
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
    attributesForm: vm.$form.createForm(vm),
    attributes: [],
    relationAttributeList: [],
    relationAttributeListForm: vm.$form.createForm(vm),
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
            'attributes',
            `relationAttributeList {
              _id,
              label
              name,
              defaultValue
              allowNull
              mappingType
              sourceValue
              target
            }`
          ],
          alias: 'modelList'
        })
        // name 是唯一字段，查询出的 model 是长度为1的数组
        const [model] = modelList
        const { attributes, relationAttributeList } = model
        this.attributes = _.orderBy(attributes, ['orderBy'], ['asc'])
        // FIXME: 关系信息 tab 页签闪烁
        this.relationAttributeList = relationAttributeList
        this.relationAttributeList.length && await this.loadRelationTargetList()
      } catch (e) {
        this.relationAttributeList = []
        throw e
      } finally {
        this.loading = false
      }
    },
    async loadRelationTargetList () {
      const { relationAttributeList } = this
      const modelList = relationAttributeList.map(({ target }) => target)
      console.log(modelList)
      try {
        const { data: { targetList } } = await ModelService.find({
          where: {
            name: { _in: modelList }
          },
          fields: [
            'name',
            'label',
            'value: name',
            `children: instanceList {
              label
              value: name
              parentName
            }`
          ],
          alias: 'targetList'
        })
        relationAttributeList.forEach((attribute, index) => {
          Object.assign(attribute, {
            // 为 DynamicForm / DynamicFormItem 保持一致入参
            selectGroupList: targetList[index] ? [targetList[index]] : [],
            displayType: 'SELECT'
          })
        })
        // console.log(relationAttributeList)
        this.relationAttributeList = relationAttributeList
      } catch (e) {
        throw e
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
    async add (parentName, parentTree) {
      this.title = '新增'
      this.visible = true
      this.submit = this.insert
      this.parentName = parentName
      this.parentTree = parentTree
      this.loading = true
      await Promise.all([
        this.loadAttributes(parentName),
        this.loadRelationTargetList(parentName)
      ])
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
      const keys = this.attributes.map(attribute => attribute.name)
      await Timeout.set()
      this.form.setFieldsValue(_.pick(this.instance.values, [...keys]))
    },
    cancel () {
      this.visible = false
      // FIXME: afterClose 未生效?
      // this.reset()
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
      this.form && this.form.resetFields && this.form.resetFields()
      console.log(222)
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
    overflow: auto;
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
