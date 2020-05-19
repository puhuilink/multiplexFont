<template>
  <div class="ResourceInstanceList">
    <a-spin :spinning="loading">
      <CTable
        ref="table"
        :data="loadData"
        :columns="columns"
        :rowKey="el => el._id"
        :rowSelection="readOnly ? null : rowSelection"
        :scroll="scroll"
      >

        <!-- / 查询区域 -->
        <template #query>
          <a-form layout="inline" :class="readOnly ? 'form__only' : 'form'">
            <div :class="{ fold: !advanced }">
              <a-row v-for="(fields, index) in queryFields" :key="index" v-show="index === 0 || (index > 0 && advanced)">
                <a-col
                  v-for="field in fields"
                  :key="field._id"
                  :md="12"
                  :sm="24"
                >
                  <Factory :field="field" />
                </a-col>
              </a-row>
            </div>

            <span :class="advanced ? 'expand' : 'collapse'" v-show="queryParams.values.length">
              <QueryBtn @click="query" />
              <ResetBtn @click="resetQueryParams" />
              <ToggleBtn @click="toggleAdvanced" :advanced="advanced" v-show="queryParams.values.length > 2" />
            </span>
          </a-form>
        </template>

        <!-- / 操作区域 -->
        <template #operation v-if="!readOnly">
          <a-button @click="onAdd">新增</a-button>
          <a-button @click="onEdit" :disabled="!hasSelectedOne">编辑</a-button>
          <a-button @click="onBatchDelete" :disabled="!hasSelected">删除</a-button>
          <a-button>数据检查</a-button>
        </template>

      </CTable>
    </a-spin>

    <ResourceInstanceSchema
      v-if="!readOnly"
      ref="schema"
      @addSuccess="query()"
      @editSuccess="query(false)"
    />
  </div>
</template>

<script>
import ResourceInstanceSchema from './ResourceInstanceSchema/index'
import { InstanceService, ModelService } from '@/api-hasura/index'
import { generateJsonbQuery, generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import deleteCheck from '@/components/DeleteCheck'
import Factory from './modules/Factory'
import List from '@/components/Mixins/Table/List'

const defaultColumns = [
  {
    title: 'ID',
    dataIndex: '_id',
    width: 180,
    order: -2
  },
  {
    title: 'parent',
    dataIndex: 'parentName',
    width: 120,
    order: -1
  }
]

export default {
  name: 'ResourceInstanceList',
  mixins: [List],
  props: {
    parentName: {
      type: String,
      default: ''
    },
    parentTree: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ResourceInstanceSchema,
    Factory
  },
  data: () => ({
    attributes: [],
    loading: false,
    // 查询参数
    queryParams: {
      values: []
    }
  }),
  computed: {
    // 表格列
    columns () {
      const columns = defaultColumns.concat(this.attributes.filter(({ hidden }) => !hidden).map(({ label, name, width = 0 }) => ({
        title: label,
        dataIndex: `values.${name}`,
        width: width + 90
        // FIXME: 数据量庞大情况下采用 tooltip 有性能问题
        // tooltip: true
      })))
      return _.orderBy(columns, ['order'], ['asc'])
    },
    // 查询区域内容
    queryFields () {
      const { queryParams: { values } } = this
      return _.chunk(values, 2)
    },
    // 表格纵向滚动高度
    scrollY () {
      return 'max(calc(100vh - 390px), 100px)'
    }
  },
  watch: {
    '$props': {
      immediate: false,
      deep: true,
      async handler () {
        this.reset()
        this.loadAttributes()
        this.query()
      }
    }
  },
  methods: {
    /**
     * 加载模型属性
     */
    async loadAttributes () {
      try {
        this.loading = true
        const { data: { modelList } } = await ModelService.find({
          where: {
            name: this.where.parentName
          },
          fields: [
            'attributes'
          ],
          alias: 'modelList'
        })
        const [{ attributes }] = modelList
        this.attributes = attributes
      } catch (e) {
        this.attributes = []
        throw e
      } finally {
        const keys = ['displayType', 'label', 'sourceValue', 'value']
        this.queryParams.values = this.attributes.filter(({ searchField }) => !!searchField).map(el => Object.assign(_.pick(el, keys), { value: null }))
        this.loading = false
      }
    },
    /**
     * 加载表格数据回调
     */
    async loadData (parameter) {
      return InstanceService.list({
        where: {
          ...this.where,
          ...generateQuery(_.omit(this.queryParams, ['values'])),
          ...generateJsonbQuery(_.pick(this.queryParams, ['values']))
        },
        fields: [
          '_id',
          'parentName',
          'name',
          'values'
        ],
        alias: 'data',
        ...parameter
      }).then(r => r.data)
    },
    /**
     * 新增实例
     * @event
     */
    onAdd () {
      const { parentName, parentTree } = this
      this.$refs['schema'].add(
        parentName,
        parentTree
      )
    },
    /**
     * 编辑实例
     * @event
     */
    onEdit () {
      const [instance] = this.selectedRows
      const { parentName, _id } = instance
      this.$refs['schema'].edit(parentName, _id)
    },
    /**
     * 批量删除实例
     * @event
     */
    async onBatchDelete () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.$refs['table'].loading = true
        await InstanceService.batchDelete(this.selectedRowKeys)
        this.notifyDeleteSuccess()
        await this.query(false)
      } catch (e) {
        this.notifyError(e)
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    /**
     * 重置查询条件
     */
    resetQueryParams () {
      const { values } = this.queryParams
      this.queryParams.values = values.map(el => ({ ...el, value: null }))
    }
  },
  created () {
    this.loadAttributes()
  }
}
</script>

<style lang="less">
</style>
