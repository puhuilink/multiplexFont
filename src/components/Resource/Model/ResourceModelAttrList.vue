<template>
  <div class="ResourceModelAttrList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      :rowKey="el => `${el.rid}`"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
      :scroll="{ x: 1580, y: 850}"
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
      </template>
    </CTable>

    <ResourceModelAttrSchema
      :did="where.did._eq"
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
import Template from '../../../views/design/moduels/template/index'

const query = gql`query ($where:ngecc_model_attributes_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_model_attributes_order_by!]) {
  pagination: ngecc_model_attributes_aggregate (where: $where) {
    aggregate {
      count
    }
  }
  data: ngecc_model_attributes (offset: $offset, limit: $limit, where: $where, order_by: $orderBy) {
    alertmessage_s
    allowinheritance_b
    allownull_b
    assetsattr_b
    datatype_s
    displaytype_s
    did
    defaultvalue_s
    edit_b
    _id_s
    label_s
    matchtype_s
    hidden_b
    name_s
    operationvalue_s
    order_i
    rid
    sourcevalue_s
    sourcetype_s
    searchfield_b
    tabgroup_s
    uniquenessscope_s
    uniqueness_b
    width_i
  }
}
`
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
            dataIndex: 'label_s',
            sorter: true,
            width: 180
          },
          {
            title: '属性名称',
            dataIndex: 'name_s',
            sorter: true,
            width: 300
          },
          {
            title: '显示宽度',
            dataIndex: 'width_i',
            sorter: true,
            width: 100
          },
          {
            title: '数据类型',
            dataIndex: 'datatype_s',
            sorter: true,
            width: 100
          },
          {
            title: '显示类型',
            dataIndex: 'displaytype_s',
            sorter: true,
            width: 180
          },
          {
            title: '非空',
            dataIndex: 'allownull_b',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '源值',
            dataIndex: 'sourcevalue_s',
            sorter: true,
            width: 180
          },
          {
            title: '继承',
            dataIndex: 'allowinheritance_b',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '隐藏',
            dataIndex: 'hidden_b',
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
        // TODO: toast
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
          orderBy: {
            rid: 'desc'
          },
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
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
