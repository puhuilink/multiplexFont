<template>
  <div class="ResourceModelRelationAttrList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="_id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, selectedRows: selectedRows, onChange: selectRow}"
      :scroll="scroll"
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

          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQueryParams">重置</a-button>
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
import List from '@/components/Mixins/Table/List'
import OperationNotification from '@/components/Mixins/OperationNotification'

export default {
  name: 'ResourceModelRelationAttrList',
  mixins: [List, OperationNotification],
  components: {
    CTable,
    ModelRelationAttrSchema
  },
  data: () => ({
    // 查询参数
    queryParams: {}
  }),
  computed: {
    columns: {
      get () {
        return [
          {
            title: '名称',
            dataIndex: 'name',
            sorter: true,
            width: 300,
            ellipsis: true
          },
          {
            title: '显示名称',
            dataIndex: 'label',
            sorter: true,
            width: 300,
            ellipsis: true
          },
          {
            title: '源',
            dataIndex: 'source',
            sorter: true,
            width: 100,
            ellipsis: true
          },
          {
            title: '目标',
            dataIndex: 'target',
            sorter: true,
            width: 100,
            ellipsis: true
          },
          {
            title: '映射类型',
            dataIndex: 'mappingType',
            sorter: true,
            width: 180,
            ellipsis: true
          },
          {
            title: '关系类型',
            dataIndex: 'relationType',
            sorter: true,
            width: 180,
            ellipsis: true
            // customRender: val => val ? '是' : '否'
          },
          {
            title: '所属分组',
            dataIndex: 'tabGroup',
            sorter: true,
            width: 180,
            ellipsis: true
          },
          {
            title: '排序',
            dataIndex: 'order',
            sorter: true,
            width: 180,
            ellipsis: true
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
            width: 180,
            ellipsis: true
          },
          {
            title: '是否作为查询框',
            dataIndex: 'searchField',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          // {
          //   title: '匹配条件',
          //   dataIndex: 'matchType',
          //   sorter: true,
          //   width: 180,
          //   ellipsis: true
          // },
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
    fields: {
      get () {
        return [
          '_id',
          ...this.columns.map(({ dataIndex }) => dataIndex)
        ]
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
        this.notifyDeleteSuccess()
        this.$refs['table'].refresh(false)
      } catch (e) {
        this.notifyError(e)
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    edit () {
      const [record] = this.selectedRows
      this.$refs['schema'].edit(_.pick(record, this.fields))
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
        fields: this.fields,
        ...parameter
      }).then(r => r.data)
    }
  }
}
</script>

<style lang="less">

</style>
