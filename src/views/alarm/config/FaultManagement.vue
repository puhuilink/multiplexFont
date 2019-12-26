/*
 * 故障前转路径管理
 * Author: yizhu liu
 * Date: 2019-12-26 15:27:32
 * Email: lyz02413@163.com
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
        <a-button>新建</a-button>
        <a-button :disabled="!hasSelected">编辑</a-button>
        <a-button :disabled="!hasSelected">删除</a-button>
        <a-button :disabled="!hasSelected">启用</a-button>
        <a-button :disabled="!hasSelected">停用</a-button>
        <a-button :disabled="!hasSelected">关联故障</a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <s-table
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
            v-if="text=='0'"
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
      </s-table>
      <!-- E 列表 -->
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getForwardWayList } from '@/api/alarmConfig'

export default {
  name: 'FaultManagement',
  components: {
    STable,
    Ellipsis
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
          dataIndex: 'forwardName',
          width: 180,
          sorter: true
        },
        {
          title: '前转类型',
          dataIndex: 'forwardType',
          width: 100,
          sorter: true
        },
        {
          title: '系统前转目标',
          dataIndex: 'systemTarget',
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
          dataIndex: 'appExplain',
          sorter: true,
          width: 350,
          scopedSlots: { customRender: 'appExplain' }
        },
        {
          title: '前转周期',
          dataIndex: 'period',
          width: 100,
          sorter: true
        },
        {
          title: '发送标志',
          dataIndex: 'sendMark',
          width: 100,
          sorter: true
        },
        {
          title: '启用标志',
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '前转模板',
          width: 100,
          dataIndex: 'template'
        },
        {
          title: '备注',
          width: 100,
          dataIndex: 'remark'
        }
      ],
      loadData: parameter => {
        // this.selectedRowKeys = []
        return getForwardWayList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
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
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
