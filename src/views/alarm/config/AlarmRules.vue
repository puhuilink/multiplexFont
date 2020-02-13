/*
 * 告警规则
 */
<template>
  <div class="alarms-rules">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="规则名称">
                <a-input v-model="queryParam.ruleName" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select
                  defaultValue="checkAll"
                  style="width: 100%;"
                  v-model="queryParam.ruleStatus"
                >
                  <a-select-option value="using">启用</a-select-option>
                  <a-select-option value="forbidden">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- E 搜索 -->

      <!-- S 操作栏 -->
      <div class="opration">
        <a-select defaultValue="checkAll" style="width: 140px; margin-right:10px;" @change="handleChange">
          <a-select-option value="checkAll">全部规则</a-select-option>
          <a-select-option
            v-for="item in ruleList"
            :key="item.value"
            :value="item.value"
          >{{ item.label }}</a-select-option>
        </a-select>
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
          @click="enableCtrl"
        >
          启用
        </a-button>
        <a-button
          :disabled="!this.selectedRowKeys.length > 0"
          @click="disableCtrl"
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
        :customRow="customRow"
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
import detail from './modules/AlarmRuleDetail'
import deleteCheck from '@/components/DeleteCheck'
import AbleCheck from '@/components/AbleCheck'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query instanceList($limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_alert_rule_order_by!]) {
    pagination: t_alert_rule_aggregate(where: {}) {
      aggregate {
        count
      }
    }
  data: t_alert_rule(offset: $offset, limit: $limit, order_by: $orderBy) {
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

export default {
  name: 'AlarmsRules',
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
      ruleList: [
        {
          value: 'alert-classify',
          label: '告警分类规则'
        },
        {
          value: 'alert-filter',
          label: '告警过滤规则'
        },
        {
          value: 'alert-merge',
          label: '告警合并规则'
        },
        {
          value: 'alert-relate',
          label: '告警关联规则'
        },
        {
          value: 'alert-upgrade',
          label: '告警升级规则'
        },
        {
          value: 'alert-recover',
          label: '告警恢复规则'
        }
      ],
      columns: [
        {
          title: '规则名称',
          dataIndex: 'title',
          sorter: true
        },
        {
          title: '规则类型',
          dataIndex: 'rule_type',
          sorter: true,
          customRender: (text) => {
            switch (text) {
              case 'alert-classify':
                return '分类'
              case 'alert-filter':
                return '过滤'
              case 'alert-merge':
                return '合并'
              case 'alert-relate':
                return '关联'
              case 'alert-upgrade':
                return '升级'
              case 'alert-recover':
                return '恢复'
              case 'alert-forward':
                return '故障'
              default:
                return text
            }
          }
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
          sorter: true,
          customRender: (text) => {
            text += ''
            switch (text) {
              case '0':
                return '低'
              case '10':
                return '中'
              case '20':
                return '高'
              default:
                return text
            }
          }
        },
        {
          title: '例外',
          dataIndex: 'rulecomments',
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
      loadData: parameter => {
        return apollo.clients.alert.query({
          query,
          variables: {
            ...parameter,
            ...this.queryParams
          }
        }).then(r => r.data)
      },
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
    /**
     * 行属性,表格点击事件
     */
    customRow (record, index) {
      return {
        on: {
          dblclick: () => {
            this.$refs.detail.open(record, 'Edit')
          }
        }
      }
    },
    /**
     * 删除选中项
     */
    async deleteCtrl () {
      await deleteCheck.sureDelete() &&
        console.log('确定删除')
    },
    /**
     * 确定启用
     */
    async enableCtrl () {
      await AbleCheck.enable() &&
        console.log('确定启用')
    },
    /**
     * 确定禁用
     */
    async disableCtrl () {
      await AbleCheck.disable() &&
        console.log('确定停用')
    }
  }
}
</script>

<style scoped>

</style>
