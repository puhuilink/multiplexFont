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
    <a-spin :spinning="spinning" v-if="visible">
      <a-tabs defaultActiveKey="1">

        <a-tab-pane tab="基本信息" key="1">
          <DynamicForm ref="attrFormWrapper" :fields="attributes" />
        </a-tab-pane>

        <a-tab-pane tab="关系信息" key="2" forceRender v-if="hasPointOutInstanceList">
          <DynamicForm ref="relationAttrFormWrapper" :fields="relationAttributeList" />
        </a-tab-pane>

        <a-tab-pane tab="指入关系" key="3" forceRender v-if="hasPointInInstanceList">
          <CTable
            ref="pointInTable"
            rowKey="_id"
            :columns="[
              {
                title: 'ID',
                dataIndex: '_id',
                sorter: true
              },{
                title: '名称',
                dataIndex: 'name',
                sorter: true
              },
              {
                title: '显示名称',
                dataIndex: 'label',
                sorter: true
              }
            ]"
            :scroll="{ y: 480 }"
            :data="loadPointInData"
          >

            <template #query>
              <a-form layout="inline">
                <div class="fold">
                  <a-row>
                    <a-col :md="12" :sm="24">
                      <a-form-item
                        label="ID"
                        :labelCol="{ span: 4 }"
                        :wrapperCol="{ span: 14, offset: 2 }"
                        style="width: 100%"
                      >
                        <a-input allowClear v-model="pointInQueryParams._id" placeholder=""/>
                      </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                      <a-form-item
                        label="显示名称"
                        :labelCol="{ span: 4 }"
                        :wrapperCol="{ span: 14, offset: 2 }"
                        style="width: 100%"
                      >
                        <a-input allowClear v-model="pointInQueryParams.label" placeholder=""/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>

                <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
                  <a-button type="primary" @click="$refs['pointInTable'].refresh(true)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="pointInQueryParams = {}">重置</a-button>
                  <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a> -->
                </span>
              </a-form>
            </template>

          </CTable>
        </a-tab-pane>

        <a-tab-pane tab="关系拓扑图" key="4" forceRender v-if="hasTopologicalGraph">
          <div ref="relationTopologicalGraph" style="width: 100%; height: 400px;"></div>
        </a-tab-pane>

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
import DynamicForm from '../Utils/DynamicForm'
import _ from 'lodash'
import Timeout from 'await-timeout'
import echarts from 'echarts'
import CTable from '@/components/Table/CTable'
import { generateQuery } from '@/utils/graphql'

export default {
  name: 'ResourceInstanceSchema',
  components: {
    DynamicForm,
    CTable
  },
  props: {},
  data: (vm) => ({
    advanced: false,
    attributes: [],
    relationAttributeList: [],
    loading: false,
    spinning: false,
    instance: null,
    submit: () => {},
    pointInQueryParams: {},
    title: '',
    visible: false
  }),
  computed: {
    hasPointInInstanceList () {
      const { instance } = this
      return instance && instance.pointInInstanceList.length
    },
    hasPointOutInstanceList () {
      const { instance } = this
      return instance && instance.pointOutInstanceList.length
    },
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
    /**
     * 加载实例详情
     * @param {String} _id 实例 id
     * @return {Promise<any>}
     */
    async loadData (_id) {
      try {
        this.instance = await InstanceService.detail(_id)
        this.setFormValue()
        this.hasTopologicalGraph && this.setRelationTopologicalGraph()
      } catch (e) {
        this.instance = null
        throw e
      }
    },
    async loadPointInData (parameter) {
      const { instance: { pointInInstanceList } } = this
      return InstanceService.find({
        where: {
          name: {
            _in: pointInInstanceList.map(({ source }) => source)
          },
          ...generateQuery(this.pointInQueryParams)
        },
        fields: [
          '_id',
          'name',
          'label'
        ],
        alias: 'data',
        ...parameter
      }).then(r => r.data)
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
      relationAttrFormWrapper && relationAttrFormWrapper.form.setFieldsValue(_.pick(pointOutInstanceList, [...relationAttrNameList]))
    },
    async getFormFields () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          err ? reject(err) : resolve(values)
        })
      })
    },
    /**
     * 绘制关系拓扑图
     */
    setRelationTopologicalGraph () {
      const setChart = async () => {
        const { name, label, pointInInstanceList, pointOutInstanceList } = this.instance
        // 等待 DOM 挂载
        await Timeout.set()
        const pointOutOption = pointOutInstanceList.map(({ target }) => ({
          name: target,
          target,
          symbolSize: 20,
          source: label,
          draggable: true
        }))
        const pointInOption = pointInInstanceList.map(({ source }) => ({
          name: source,
          source,
          symbolSize: 20,
          target: label,
          draggable: true
        }))
        const myChart = echarts.init(this.$refs['relationTopologicalGraph'])
        const centerPoint = {
          name: label,
          fixed: true,
          x: myChart.getWidth() / 2,
          y: myChart.getHeight() / 2,
          // 图形大小
          symbolSize: 20,
          id: label,
          draggable: false
        }
        const data = [
          centerPoint,
          ...pointOutOption,
          ...pointInOption
        ]
        const edges = [
          // centerPoint,
          ...pointOutOption,
          ...pointInOption
        ]
        // console.log(pointOutOption, pointInOption)
        const option = {
          toolbox: {
            show: true,
            feature: {
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          tooltip: {
            show: true
          },
          legend: [{
            data: data.map(({ name }) => name)
          }],
          series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            // 所有点
            data: data,
            force: {
              gravity: 0,
              repulsion: 100,
              // 点与点间距离
              edgeLength: 135
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [0, 10],
            // 点与点的连线关系
            links: edges.map(({ source, target }) => ({
              source: source,
              target: target
            }))
          }]
        }
        myChart.setOption(option)
      }
      // FIXME
      // window.addEventListener('resize', setChart)
      // this.$on('beforeDestroy', () => window.removeEventListener('resize', setChart))
      setChart()
    },
    async add (parentName, parentTree) {
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
