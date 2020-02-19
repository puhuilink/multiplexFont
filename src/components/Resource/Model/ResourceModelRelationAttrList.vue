<template>
  <div class="ResourceModelRelationAttrList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="did"
      :rowSelection="{selectedRowKeys: selectedRowKeys, selectedRows: selectedRows, onChange: selectRow}"
      :scroll="{ x: 1760, y: 850}"
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
                  <a-input v-model="queryParams.name_s" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="显示名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.label_s" placeholder=""/>
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
        <a-button>数据检查</a-button>
        <a-button>筛选</a-button>
      </template>
    </CTable>

    <ResourceModelRelationSchema
      ref="schema"
      @addSuccess="() => { this.reset(); this.query() }"
      @editSuccess="$refs['table'].refresh(false)"
    />
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import ResourceModelRelationSchema from './ResourceModelRelationSchema'
import deleteCheck from '@/components/DeleteCheck'

const query = gql`query ($where:ngecc_relationattribute_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_relationattribute_order_by!]) {
  pagination: ngecc_relationattribute_aggregate (where: $where) {
    aggregate {
      count
    }
  }
  data: ngecc_relationattribute (offset: $offset, limit: $limit, where: $where, order_by: $orderBy) {
    did
    _id_s
    name_s
    label_s
    source_s
    target_s
    mappingtype_s
    relationtype_s
    tabgroup_s
    order_i
    allowinheritance_b
    allownull_b
  }
}
`

const deleteAttrs = gql`mutation delete_relationattributes ($dids: [Int!] = []) {
  delete_ngecc_relationattribute (where: {
    did: {
      _in: $dids
    }
  }) {
    affected_rows
  }
}`

export default {
  name: 'ResourceModelRelationAttrList',
  components: {
    CTable,
    ResourceModelRelationSchema
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
            title: '名称',
            dataIndex: 'name_s',
            sorter: true,
            width: 180
          },
          {
            title: '显示名称',
            dataIndex: 'label_s',
            sorter: true,
            width: 300
          },
          {
            title: '源',
            dataIndex: 'source_s',
            sorter: true,
            width: 100
          },
          {
            title: '目标',
            dataIndex: 'target_s',
            sorter: true,
            width: 100
          },
          {
            title: '映射类型',
            dataIndex: 'mappingtype_s',
            sorter: true,
            width: 180
          },
          {
            title: '关系类型',
            dataIndex: 'relationtype_s',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '所属分组',
            dataIndex: 'tabgroup_s',
            sorter: true,
            width: 180
          },
          {
            title: '排序',
            dataIndex: 'order_i',
            sorter: true,
            width: 180
          },
          {
            title: '是否继承',
            dataIndex: 'allowinheritance_b',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '非空',
            dataIndex: 'allownull_b',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          }
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
        this.where.source_s._eq
      )
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
            dids: [
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
    loadData (parameter) {
      return apollo.clients.resource.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            ...this.queryParams.label_s ? {
              label_s: {
                _ilike: `%${this.queryParams.label_s.trim()}%`
              }
            } : {},
            ...this.queryParams.name_s ? {
              name_s: {
                _ilike: `%${this.queryParams.name_s.trim()}%`
              }
            } : {}
          }
        }
      }).then(r => r.data)
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
