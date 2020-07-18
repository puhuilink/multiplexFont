/*
 * 告警类型
 */
<template>
  <div class="alarms-types">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="显示名称">
                <a-input v-model="queryParam.label_s" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属节点类型">
                <a-input v-model="queryParam.nodetype_s" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="告警编码">
                  <a-input v-model="queryParam.id_s" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="query">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- E 搜索 -->

      <!-- S 操作栏 -->
      <div class="opration">
        <a-button
          type="primary"
          icon="plus"
          @click="add"
        >
          新增
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
        rowKey="rid"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      />
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
import detail from './modules/AlarmTypesDetail'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
const query = gql`query instanceList($where: ngecc_instance_values_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [ngecc_instance_values_order_by!]) {
  pagination: ngecc_instance_values_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data:  ngecc_instance_values(offset: $offset, limit: $limit, order_by: $orderBy, where: $where) {
    rid
    id_s
    icon_s
    ispageadd_s
    description_1_s
    name_s
    domain_s
    enable_b
    label_s
    nodetype_s
    parentname_s
    updatetime_t
  }
}`

const deleteAttrs = gql`mutation ($rids: [Int!] = []) {
  # instance表删除
  delete_ngecc_instance_values (where: {
    rid: {
      _in: $rids
    }
  }) {
    affected_rows
  }
}`
//  # 关联解除
// delete_ngecc_relationinstance (where: {
//   name_s: {
//     _in: $nameList
//   }
// }) {
//   affected_rows
// }
export default {
  name: 'AlarmsTypes',
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
          title: '更新时间',
          dataIndex: 'updatetime_t',
          sorter: true
        },
        {
          title: '名称',
          dataIndex: 'name_s',
          sorter: true
        },
        {
          title: '显示名称',
          dataIndex: 'label_s',
          sorter: true
        },
        {
          title: '图标',
          dataIndex: 'icon_s',
          sorter: true
        },
        {
          title: '数据权限域',
          dataIndex: 'domain_s',
          sorter: true
        },
        {
          title: '告警编码',
          dataIndex: 'id_s',
          sorter: true
        },
        {
          title: '所属模型',
          dataIndex: 'nodetype_s',
          sorter: true
        }
      ],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  computed: {},
  methods: {
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
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
            this.$refs['detail'].open(record, 'See')
          }
        }
      }
    },
    loadData (parameter) {
      // eslint-disable-next-line no-undef
      return apollo.clients.resource.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            'parentname_s': {
              '_eq': 'Alert'
            },
            ...this.queryParam.label_s ? {
              label_s: {
                _ilike: `%${this.queryParam.label_s.trim()}%`
              }
            } : {},
            ...this.queryParam.nodetype_s ? {
              nodetype_s: {
                _ilike: `%${this.queryParam.nodetype_s.trim()}%`
              }
            } : {},
            ...this.queryParam.id_s ? {
              id_s: {
                _ilike: `%${this.queryParam.id_s.trim()}%`
              }
            } : {}
          }
        }
      }).then(r => r.data)
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    add () {
      this.$refs['detail'].open('', 'New')
    },
    edit () {
      this.$refs.detail.open(this.selectedRows[0], 'Edit')
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
