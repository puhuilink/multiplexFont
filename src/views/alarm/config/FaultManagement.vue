/*
 * 故障前转路径管理
 */
<template>
  <div class="fault-management ">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="前转路径名称">
                <a-input v-model="queryParam.forwardName" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="前转类型">
                <a-select
                  allowClear
                  v-model="queryParam.forwardType"
                  placeholder="请选择"
                  default-value="checkall"
                >
                  <a-select-option
                    v-for="item in forwardType"
                    :key="item"
                    :value="item"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="系统前转目标">
                  <a-input v-model="queryParam.systemTarget" placeholder=""/>
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
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary">查询</a-button>
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
          @click="$refs.detail.open('', 'New')"
        >
          新建
        </a-button>
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
        <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="$refs.correlation.open(selectedRows[0])"
        >
          关联故障
        </a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <CTable
        ref="table"
        size="small"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: 1800, y:400 }"
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
        <span slot="appExplain" slot-scope="text">
          <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
        </span>
      </CTable>
      <!-- E 列表 -->

      <!-- S 模块 -->
      <detail ref="detail"></detail>
      <correlation ref="correlation"></correlation>
      <!-- E 模块 -->
    </a-card>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import deleteCheck from '@/components/DeleteCheck'
import AbleCheck from '@/components/AbleCheck'
import detail from './modules/FMDetail'
import correlation from './modules/FMCorrelation'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query instanceList($limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_forward_path_order_by!]) {
    pagination: t_forward_path_aggregate(where: {}) {
      aggregate {
        count
      }
    }
  data: t_forward_path (offset: $offset, limit: $limit, order_by: $orderBy) {
    enabled
    forward_comment
    forward_destination
    forward_path_id
    forward_path_title
    forward_type
    forward_user
    incident_severity
    incident_type
    send_cycle
    send_tag
    template_name
    template_path
  }
}`
export default {
  name: 'FaultManagement',
  components: {
    CTable,
    Ellipsis,
    detail,
    correlation
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      forwardType: [
        '运维系统', '邮件', '短信'
      ],
      columns: [
        {
          title: '前转路径名称',
          dataIndex: 'forward_path_title',
          width: 180,
          sorter: true
        },
        {
          title: '前转类型',
          dataIndex: 'forward_type',
          width: 100,
          sorter: true
        },
        {
          title: '系统前转目标',
          dataIndex: 'forward_user',
          width: 200,
          sorter: true
        },
        {
          title: '其他前转目标',
          dataIndex: 'otherTarget',
          width: 150,
          sorter: true
        },
        {
          title: '应用说明',
          dataIndex: 'app_note_s',
          sorter: true,
          width: 350,
          scopedSlots: { customRender: 'appExplain' }
        },
        {
          title: '前转周期',
          dataIndex: 'send_cycle',
          width: 100,
          sorter: true
        },
        {
          title: '发送标志',
          dataIndex: 'send_tag',
          width: 100,
          sorter: true
        },
        {
          title: '启用标志',
          dataIndex: 'enabled',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '前转模板',
          width: 100,
          dataIndex: 'template_path'
        },
        {
          title: '备注',
          width: 100,
          dataIndex: 'forward_comment'
        }
      ],
      loadData: parameter => {
        // 清空选中
        this.selectedRowKeys = []
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
        case '0':
          return '已启用'
        case '1':
          return '已禁用'
        default:
          return ''
      }
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
          click: () => {
            console.log(record, index)
          },
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
