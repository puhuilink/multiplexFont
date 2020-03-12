/*
 * 生成故障规则
 */
<template>
  <div class="geberating-fault-rules">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="规则名称">
                <a-input v-model="queryParam.title" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select
                  defaultValue=""
                  style="width: 100%;"
                  v-model="queryParam.enabled"
                >
                  <a-select-option value="true">启用</a-select-option>
                  <a-select-option value="false">禁用</a-select-option>
                </a-select>
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
        <a-button @click="$refs.detail.open('', 'New')">新建</a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="$refs.detail.open(selectedRows[0], 'Edit')"
        >
          编辑
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length == 0"
          @click="deleteCtrl"
        >
          删除
        </a-button>
        <a-button
          :disabled="!this.selectedRowKeys.length > 0"
          @click="enableCtrl(true)"
        >
          启用
        </a-button>
        <a-button
          :disabled="!this.selectedRowKeys.length > 0"
          @click="enableCtrl(false)"
        >
          停用
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
        <span slot="status" slot-scope="text">
          <a-icon
            v-if="text"
            type="check-circle"
            theme="filled"
            :title="text | statusTitleFilter"
            :style="{color:'#00c356'}"
          />
          <a-icon
            v-else
            type="close-circle"
            theme="filled"
            :title="text | statusTitleFilter"
            :style="{color:'#f97160'}"
          />
        </span>
      </CTable>
      <!-- E 列表 -->

      <!-- S 模块 -->
      <detail ref="detail"></detail>
      <!-- E 模块 -->
    </a-card>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
// import { getAlarmRuleList } from '@/api/alarmConfig'
import deleteCheck from '@/components/DeleteCheck'
// import AbleCheck from '@/components/AbleCheck'
import detail from './modules/GFRDetail'
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

const enableUpdate = gql`mutation update_t_alert_rule ($ruleId: [numeric!] = [], $enabled: Boolean!) {
  update_t_alert_rule(
    where: {
      rule_id: {
        _in: $ruleId
      }
    },
    _set: {
      enabled: $enabled
    }
  ) {
    affected_rows
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
  name: 'GeneratingFaultRules',
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
          title: '规则名称',
          dataIndex: 'title',
          sorter: true
        },
        {
          title: '节点类型',
          dataIndex: 'node_type',
          sorter: true
        },
        {
          title: '域',
          dataIndex: 'domain',
          sorter: true
        },
        {
          title: '优先级',
          dataIndex: 'priority',
          sorter: true
        },
        {
          title: '例外',
          dataIndex: 'exception',
          sorter: true
        },
        {
          title: '编辑时间',
          dataIndex: 'updatedate',
          sorter: true
        },
        {
          title: '状态',
          dataIndex: 'enabled',
          scopedSlots: { customRender: 'status' }
        }
      ],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  filters: {
    statusTitleFilter (type) {
      type += ''
      switch (type) {
        case 'true':
          return '已启用'
        case 'false':
          return '已禁用'
        default:
          return ''
      }
    }
  },
  computed: {},
  methods: {
    /**
     * 表格展示规则类型过滤
     */
    handleChange (value) {
      console.log(`selected ${value}`)
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
    loadData (parameter) {
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            rule_type: {
              _eq: 'alert-forward'
            },
            ...this.queryParam.title ? {
              title: {
                _ilike: `%${this.queryParam.title.trim()}%`
              }
            } : {},
            ...this.queryParam.enabled ? {
              enabled: {
                _eq: this.queryParam.enabled === 'true'
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
        // FIXME: 是否存在分页问题
        this.$refs['table'].refresh(false)
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    /**
     * 启用/停用
     */
    async enableCtrl (value) {
      if (!await deleteCheck.confirm({ content: value ? '确定启用吗？' : '确定停用吗？' })) {
        return
      }
      try {
        this.$refs['table'].loading = true
        await apollo.clients.alert.mutate({
          mutation: enableUpdate,
          variables: {
            ruleId: this.selectedRowKeys,
            enabled: value
          }
        })
        // TODO: toast
        this.query()
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
        // this.$message.info(value ? '成功启用' : '成功停用')
      }
    }
  }
}
</script>

<style scoped>

</style>
