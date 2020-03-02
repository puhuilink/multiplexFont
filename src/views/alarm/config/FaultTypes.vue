/*
 * 故障类型
 */
<template>
  <div class="faults-types">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="故障分类名称">
                <a-input v-model="queryParam.type_title" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="query">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- E 搜索 -->

      <!-- S 操作栏 -->
      <div class="opration">
        <a-button
          @click="add('New')"
        >
          新建类型
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="add('NewSon')"
        >
          新建子类型
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="edit"
        >
          编辑
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length == 0"
          @click="deleteCtrl"
        >
          删除
        </a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <CTable
        ref="table"
        rowKey="type_id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
      </CTable>
      <!-- E 列表 -->

      <!-- S 模块 -->
      <detail
        ref="detail"
        @addSuccess="$refs['table'].refresh(false)"
      ></detail>
      <!-- E 模块 -->
    </a-card>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import deleteCheck from '@/components/DeleteCheck'
import detail from './modules/FTDetail'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query instanceList($where: t_incident_type_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_incident_type_order_by!]) {
    pagination: t_incident_type_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  data: t_incident_type(offset: $offset, limit: $limit, order_by: $orderBy, where: $where) {
    parent_type_id
    comments
    parent_type_title
    type_id
    type_title
  }
}`

// type_id属性更改
const deleteAttrs = gql`mutation ($typeIds: [numeric!] = []) {
  # instance表删除
  delete_t_incident_type (where: {
    type_id: {
      _in: $typeIds
    }
  }) {
    affected_rows
  }
}`
export default {
  name: 'FaultTypes',
  components: {
    CTable,
    detail
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '故障分类编号',
          dataIndex: 'type_id',
          sorter: true
        },
        {
          title: '故障分类名称',
          dataIndex: 'type_title',
          sorter: true
        },
        {
          title: '父类型名称',
          dataIndex: 'parent_type_title',
          sorter: true
        },
        {
          title: '故障分类描述',
          dataIndex: 'comments',
          sorter: true
        }
      ],
      typeList: [],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  filters: {
  },
  computed: {
    /**
     * 返回表格选中行
     */
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    /**
     * 表格展示规则类型过滤
     */
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    loadData (parameter) {
      this.selectedRowKeys = []
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.queryParam.type_title ? {
              type_title: {
                _ilike: `%${this.queryParam.type_title.trim()}%`
              }
            } : {}
          }
        }
      }).then(r => {
        this.typeList = [
          {
            type_id: 0,
            type_title: '/'
          },
          ...r.data.data
        ]
        return r.data
      })
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 选中行更改事件
     * @param selectedRowKeys
     * @param selectedRows
     */
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
     * 行属性,表格点击事件
     */
    customRow (record, index) {
      return {
        on: {
          dblclick: () => {
            this.$refs.detail.open(record, 'Edit', this.typeList)
          }
        }
      }
    },
    add (e) {
      if (e === 'New') {
        this.$refs['detail'].open('', e, this.typeList)
      } else {
        this.$refs['detail'].open(this.selectedRows[0], e, this.typeList)
      }
    },
    edit () {
      this.$refs['detail'].open(this.selectedRows[0], 'Edit', this.typeList)
    },
    /**
     * 删除选中项
     */
    async deleteCtrl () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.$refs['table'].loading = true
        await apollo.clients.alert.mutate({
          mutation: deleteAttrs,
          variables: {
            typeIds: [
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
    }
  }
}
</script>

<style scoped>

</style>
