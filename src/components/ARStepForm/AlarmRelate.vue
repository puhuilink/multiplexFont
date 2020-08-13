/*
 * 影响告警设置
 */
<template>
  <div class="alarms-relate">
    <a-card :bordered="false">

      <!-- S 操作栏 -->
      <div class="operation">
        <a-button
          :disabled="!checkRuleType"
        >
          新增
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
        >
          编辑
        </a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <CTable
        ref="table"
        rowKey="rule_id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
      </CTable>
      <!-- E 列表 -->
    </a-card>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import deleteCheck from '@/components/DeleteCheck'
// import AbleCheck from '@/components/AbleCheck'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query instanceList($where: t_alert_rule_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_alert_rule_order_by!]) {
    pagination: t_alert_rule_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  data: t_alert_rule(where: $where, offset: $offset, limit: $limit, order_by: $orderBy) {
    content
    createdate
    domain
    enabled
    is_exclusive
    node_type
    priority
    rule_id
    rule_type
    rulecomments
    title
    updatedate
  }
}`

const deleteAttrs = gql`mutation ($ruleId: [numeric!] = []) {
  delete_t_alert_rule (where: {
    rule_id: {
      _in: $ruleId
    }
  }) {
    affected_rows
  }
}`

export default {
  name: 'AlarmRelate',
  components: {
    CTable
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '节点类型',
          dataIndex: 'node_type',
          sorter: true
        },
        {
          title: '节点',
          dataIndex: 'domain',
          sorter: true
        },
        {
          title: '节点关系',
          dataIndex: 'relateType',
          sorter: true
        },
        {
          title: '告警类型',
          dataIndex: 'updatedate',
          sorter: true
        }
      ],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  methods: {
    /**
     * 选中行更改事件
     * @param selectedRowKeys
     * @param selectedRows
     */
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    loadData (parameter) {
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where
          }
        }
      }).then(r => r.data)
    },
    query () {
      this.$refs['table'].refresh(true)
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
            ruleId: [
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
