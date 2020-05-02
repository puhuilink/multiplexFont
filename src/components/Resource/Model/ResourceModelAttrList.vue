<template>
  <div class="ResourceModelAttrList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      :rowKey="el => `${el.name}`"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
      :scroll="{ x: scrollX, y: 600}"
      :showPagination="false"
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
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
          </span>
        </a-form>
      </template>
      <template #operation>
        <a-button @click="add">新建</a-button>
        <a-button @click="edit" :disabled="selectedRowKeys.length !== 1">编辑</a-button>
        <a-button @click="batchDelete" :disabled="selectedRowKeys.length === 0">删除</a-button>
      </template>
    </CTable>

    <ResourceModelAttrSchema
      ref="schema"
      @addSuccess="() => { this.reset(); this.query() }"
      @editSuccess="query"
    />
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import ResourceModelAttrSchema from './ResourceModelAttrSchema'
import deleteCheck from '@/components/DeleteCheck'
import Template from '../../../views/design/modules/template/index'
import { ModelService } from '@/api-hasura'
import _ from 'lodash'

const deleteAttrs = gql`mutation ($rids: [Int!] = []) {
  delete_ngecc_model_attributes (where: {
    rid: {
      _in: $rids
    }
  }) {
    affected_rows
  }
}`

export default {
  name: 'ResourceModelAttrList',
  components: {
    Template,
    CTable,
    ResourceModelAttrSchema
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
    // TODO: 列不全
    columns: {
      get () {
        return [
          {
            title: '显示名称',
            dataIndex: 'label',
            sorter: true,
            width: 180
          },
          {
            title: '属性名称',
            dataIndex: 'name',
            sorter: true,
            width: 300
          },
          {
            title: '显示宽度',
            dataIndex: 'width',
            sorter: true,
            width: 120
          },
          {
            title: '数据类型',
            dataIndex: 'dataType',
            sorter: true,
            width: 120
          },
          {
            title: '显示类型',
            dataIndex: 'displayType',
            sorter: true,
            width: 180
          },
          {
            title: '源类型',
            dataIndex: 'sourceType',
            sorter: true,
            width: 180
          },
          {
            title: '作为查询',
            dataIndex: 'searchField',
            sorter: true,
            width: 180
          },
          {
            title: '非空',
            dataIndex: 'allowNull',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '源值',
            dataIndex: 'sourceValue',
            sorter: true,
            width: 180
          },
          {
            title: '继承',
            dataIndex: 'allowInheritance',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '隐藏',
            dataIndex: 'hidden',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          }
        ]
      }
    },
    scrollX: {
      get () {
        return this.columns.map(column => column.width || 60).reduce((x1, x2) => x1 + x2) + 62
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
        this.query()
      }
    }
  },
  methods: {
    add () {
      this.$refs['schema'].add()
    },
    async batchDelete () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.$refs['table'].loading = true
        await apollo.clients.resource.mutate({
          mutation: deleteAttrs,
          variables: {
            rids: [
              ...this.selectedRowKeys
            ]
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: '删除成功'
        })
        // FIXME: 是否存在分页问题
        this.$refs['table'].refresh(false)
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    edit () {
      const [record] = this.selectedRows
      this.$refs['schema'].edit(record)
    },
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    async loadData (parameter) {
      this.selectedRowKeys = []
      this.selectedRows = []
      return ModelService.find({
        where: {
          ...this.where
        },
        fields: [
          'name',
          'attributes'
        ],
        alias: 'modelList'
      }).then(r => {
        const { data: { modelList } } = r//  name 全局唯一，根据 name 查询出来的是长度为 1 的数组
        const [model] = modelList
        // TODO: 查询条件
        // console.log(this.queryParams)
        const { attributes } = model
        const { orderBy = { label: 'asc' } } = parameter
        const [[ key, sort ]] = Object.entries(orderBy)
        return {
          data: _.orderBy(attributes, [key], [sort]),
          pagination: {
            aggregate: {
              count: attributes.length
            }
          }
        }
      })
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
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
