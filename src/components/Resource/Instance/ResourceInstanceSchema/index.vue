<template>
  <a-modal
    centered
    destroyOnClose
    :confirmLoading="submitLoading"
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
    <a-spin :spinning="spinning" v-if="visible">
      <a-tabs defaultActiveKey="1">

        <a-tab-pane tab="基本信息" key="1">
          <DynamicForm ref="attrFormWrapper" :fields="attributes" :mode="mode" />
        </a-tab-pane>

        <a-tab-pane tab="关系信息" key="2" forceRender v-if="hasPointOutInstanceList">
          <DynamicForm ref="relationAttrFormWrapper" :mode="mode" :fields="relationAttributeList" />
        </a-tab-pane>

        <template v-if="mode === 'edit'">
          <a-tab-pane tab="指入关系" key="3" forceRender v-if="hasPointInInstanceList">
            <CiPointInList :pointInInstanceList="instance.pointInInstanceList" />
          </a-tab-pane>

          <a-tab-pane tab="关系拓扑图" key="4" forceRender v-if="hasTopologicalGraph">
            <CiTopologicalGraph :instance="instance" />
          </a-tab-pane>
        </template>

      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
/* eslint-disable no-unused-vars */
import { editInstance, addInstance } from '@/api/controller/Instance'
import {
  InstanceService,
  ModelService,
  RelationAttributeService,
  RelationInstanceService
} from '@/api-hasura/index'
import DynamicForm from '../../Utils/DynamicForm'
import _ from 'lodash'
import Timeout from 'await-timeout'
import CiPointInList from './modules/CiPointInList'
import CiTopologicalGraph from './modules/CiTopologicalGraph'

export default {
  name: 'ResourceInstanceSchema',
  components: {
    DynamicForm,
    CiPointInList,
    CiTopologicalGraph
  },
  props: {},
  data: (vm) => ({
    // 资源实例属性
    attributes: [],
    // 资源实例关系属性
    relationAttributeList: [],
    // 提交按钮 loading
    submitLoading: false,
    // 主区域 loading
    spinning: false,
    // 编辑状态下资源实例数据
    instance: null,
    // enum { add, edit }
    mode: 'add',
    // modal submit 回调
    submit: () => {},
    // modal 标题
    title: '',
    // modal visible
    visible: false
  }),
  computed: {
    hasPointOutInstanceList () {
      const { relationAttributeList } = this
      return relationAttributeList.length
    },
    // 只在编辑时展示（可读）
    hasPointInInstanceList () {
      const { instance } = this
      return instance && instance.pointInInstanceList.length
    },
    // 只在编辑时展示（可读）
    hasTopologicalGraph () {
      const { hasPointInInstanceList, hasPointOutInstanceList } = this
      return hasPointInInstanceList || hasPointOutInstanceList
    }
  },
  methods: {
    /**
     * 加载实例的属性与关系属性（继承自模型）
     * @param {String} parentName 其所属模型的 name
     * @return {Promise<any>}
     */
    async loadAttributes (parentName, parentTree) {
      try {
        this.spinning = true
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
        this.spinning = false
      }
    },
    /**
     * 加载其关系属性关联的实例
     * @return {Promise<any>}
     */
    async loadRelationTargetList () {
      const { relationAttributeList } = this
      const modelList = relationAttributeList.map(({ target }) => target)
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
            displayType: 'SELECTED'
          })
        })
        // console.log(relationAttributeList)
        this.relationAttributeList = relationAttributeList
      } catch (e) {
        throw e
      }
    },
    /**
     * 加载实例详情
     * @param {String} _id 实例 id
     * @return {Promise<any>}
     */
    async loadData (_id) {
      try {
        this.instance = await InstanceService.detail(_id)
        this.setFormValue()
      } catch (e) {
        this.instance = null
        throw e
      }
    },
    async setFormValue () {
      const {
        instance: {
          values,
          pointInInstanceList,
          pointOutInstanceList
        },
        attributes,
        relationAttributeList
      } = this

      console.log(pointOutInstanceList)

      const { attrFormWrapper, relationAttrFormWrapper } = this.$refs

      // 模型属性
      const attrNameList = attributes.map(({ name }) => name)
      // console.log(_.pick(values, [...attrNameList]))
      // 等待 form 挂载
      await this.$nextTick()
      // TODO: 如果将 form 直接由当前组件生成，可能要用到 wrappedComponentRef
      // attrFormWrapper && attrFormWrapper.setFieldsValue(_.pick(values, [...attrNameList]))
      attrFormWrapper && attrFormWrapper.form.setFieldsValue(_.pick(values, [...attrNameList]))

      // 关系属性
      const relationAttrNameList = relationAttributeList.map(({ name }) => name)
      // console.log(_.pick(pointOutInstanceList, [...relationAttrNameList]))

      const data = _.groupBy(pointOutInstanceList, v => v.name)
      Object.keys(data).forEach(key => {
        const val = data[key].map(e => e.target)
        const [test] = val
        data[key] = test
      })

      // relationAttrFormWrapper && relationAttrFormWrapper.form.setFieldsValue(_.pick(data, [...relationAttrNameList]))
      relationAttrFormWrapper && relationAttrFormWrapper.setFieldsValue(data)

      console.log(relationAttrFormWrapper.form)
    },
    async getFormFields () {
      const { attrFormWrapper, relationAttrFormWrapper } = this.$refs
      // eslint-disable-next-line handle-callback-err
      relationAttrFormWrapper.form.validateFields((err, values) => {
        console.log(values)
      })
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          err ? reject(err) : resolve(values)
        })
      })
    },
    async add (parentName, parentTree) {
      this.mode = 'add'
      this.title = '新增'
      this.visible = true
      this.submit = this.insert
      this.parentName = parentName
      this.parentTree = parentTree
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
      this.mode = 'edit'
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
      // this.form.setFieldsValue(_.pick(this.instance.values, [...keys]))
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
      this.submitLoading = true
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
        this.submitLoading = false
      })
    },
    /**
     * 编辑
     */
    async update () {
      const value = await this.getFormFields()
      this.submitLoading = true
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
        this.submitLoading = false
      })
    },
    reset () {
      // 表单元素会在 destroyOnClose 时重置
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">
.ResourceInstanceSchema__modal {
  .ant-modal-body {
    padding-top: 0;
  }
  .ant-tabs-tabpane {
    padding-top: 0;
    height: 508px;
    overflow-y: auto;
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
