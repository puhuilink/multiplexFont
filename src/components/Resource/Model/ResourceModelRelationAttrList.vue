<template>
  <div class="ResourceModelRelationAttrList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="_id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, selectedRows: selectedRows, onChange: selectRow}"
      :scroll="{ x: scrollX, y: 850}"
    >
      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="属性名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.name" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="显示名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.label" placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
            <!--            <a @click="toggleAdvanced" style="margin-left: 8px">-->
            <!--              {{ advanced ? '收起' : '展开' }}-->
            <!--              <a-icon :type="advanced ? 'up' : 'down'"/>-->
            <!--            </a>-->
          </span>
        </a-form>
      </template>
      <template #operation>
        <a-button @click="add">新建</a-button>
        <a-button @click="edit" :disabled="selectedRowKeys.length !== 1">编辑</a-button>
        <a-button @click="batchDelete" :disabled="selectedRowKeys.length === 0">删除</a-button>
      </template>
    </CTable>

    <ModelRelationAttrSchema
      ref="schema"
      @addSuccess="() => { this.reset(); this.query() }"
      @editSuccess="$refs['table'].refresh(false)"
    />
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import ModelRelationAttrSchema from './modules/ModelRelationAttrSchema'
import deleteCheck from '@/components/DeleteCheck'
import { generateQuery } from '@/utils/graphql'
import { RelationAttributeService } from '@/api-hasura/index'
import _ from 'lodash'

export const fields = [
  '_id',
  'name',
  'label',
  'source',
  'target',
  'mappingType',
  'relationType',
  'tabGroup',
  'order',
  'allowInheritance',
  'allowNull'
]

export default {
  name: 'ResourceModelRelationAttrList',
  components: {
    CTable,
    ModelRelationAttrSchema
  },
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    advanced: false,
    // 查询参数
    queryParams: {},
    // 选中行
    selectedRows: [],
    // 选中行的 key
    selectedRowKeys: []
  }),
  computed: {
    columns: {
      get () {
        return [
          {
            title: '名称',
            dataIndex: 'name',
            sorter: true,
            width: 180
          },
          {
            title: '显示名称',
            dataIndex: 'label',
            sorter: true,
            width: 300
          },
          {
            title: '源',
            dataIndex: 'source',
            sorter: true,
            width: 100
          },
          {
            title: '目标',
            dataIndex: 'target',
            sorter: true,
            width: 100
          },
          {
            title: '映射类型',
            dataIndex: 'mappingType',
            sorter: true,
            width: 180
          },
          {
            title: '关系类型',
            dataIndex: 'relationType',
            sorter: true,
            width: 180
            // customRender: val => val ? '是' : '否'
          },
          {
            title: '所属分组',
            dataIndex: 'tabGroup',
            sorter: true,
            width: 180
          },
          {
            title: '排序',
            dataIndex: 'order',
            sorter: true,
            width: 180
          },
          {
            title: '是否继承',
            dataIndex: 'allowInheritance',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '继承',
            dataIndex: 'extendModelName',
            sorter: true,
            width: 180
          },
          {
            title: '是否作为查询框',
            dataIndex: 'searchField',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '匹配条件',
            dataIndex: 'matchType',
            sorter: true,
            width: 180
          },
          {
            title: '非空',
            dataIndex: 'allowNull',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          }
        ]
      }
    },
    scrollX: {
      get () {
        return this.columns
          .map(e => e.width || 60)
          .reduce((a, b) => a + b) + 62
      }
    }
  },
  watch: {
    '$props': {
      immediate: false,
      deep: true,
      handler (val) {
        // 重置查询条件
        this.reset()
        // 重新查询
        this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    add () {
      this.$refs['schema'].add(
        this.where.source._eq
      )
    },
    async batchDelete () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.$refs['table'].loading = true
        await RelationAttributeService.batchDelete(this.selectedRowKeys)
        this.$notification.success({
          message: '系统提示',
          description: '删除成功'
        })
        this.$refs['table'].refresh(false)
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: h => h('p', { domProps: { innerHTML: e } })
        })
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    edit () {
      const [record] = this.selectedRows
      // console.log(
      //   record,
      //   _.pick(record, [...fields])
      // )
      this.$refs['schema'].edit(_.pick(record, [...fields]))
    },
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    loadData (parameter = { orderBy: { order: 'asc' } }) {
      this.selectedRows = []
      this.selectedRowKeys = []
      return RelationAttributeService.find({
        where: {
          ...this.where,
          ...generateQuery(this.queryParams)
        },
        alias: 'data',
        fields: [...fields],
        ...parameter
      }).then(r => r.data)
      // return apollo.clients.resource.query({
      //   query,
      //   variables: {
      //     ...parameter,
      //     where: {
      //       ...this.where,
      //       ...generateQuery(this.queryParams)
      //     }
      //   }
      // }).then(r => r.data)
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 表格行选中
     * @event
     * @return {Undefined}
     */
    selectRow (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
     * 重置组件数据
     */
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">

</style>
