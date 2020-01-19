/*
 * 阈值规则
 */
<template>
  <div class="threshold-rules">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="数据域">
                <a-select
                  allowClear
                  v-model="queryParam.CIDomain"
                  placeholder="请选择"
                >
                  <a-select-opt-group
                    v-for="(group,index) in CIDomain"
                    :key="index"
                    :label="group.label"
                  >
                    <a-select-option
                      v-for="item in group.options"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="节点类型">
                <a-select
                  allowClear
                  v-model="queryParam.CIType"
                  placeholder="请选择"
                >
                  <a-select-opt-group
                    v-for="(group,index) in CIType"
                    :key="index"
                    :label="group.label"
                    :allowClear="true"
                  >
                    <a-select-option
                      v-for="item in group.options"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="KPI">
                  <a-select
                    defaultValue="checkAll"
                    style="width: 100%"
                    v-model="queryParam.KPI"
                  >
                    <a-select-option value="using">数据请求中，请稍后...</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
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
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
        <span slot="status" slot-scope="text">
          <a-icon
            v-if="text=='0'"
            type="check"
            theme="outlined"
            :title="text | statusTitleFilter"
            :style="{color:'#00c356'}"
          />
          <a-icon
            v-else
            type="close"
            theme="outlined"
            :title="text | statusTitleFilter"
            :style="{color:'#f97160'}"
          />
        </span>
      </s-table>
      <!-- E 列表 -->

      <!-- S 模块 -->
      <detail ref="detail"></detail>
      <!-- E 模块 -->
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getTRList } from '@/api/alarmConfig'
import screening from '../screening'
import deleteCheck from '@/components/DeleteCheck'
import detail from './modules/ThresholdRulesDetail'

export default {
  name: 'ThresholdRules',
  components: {
    STable,
    detail
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 筛选项的值来源
      CIDomain: screening.CIDomain,
      CIType: screening.CIType,
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          sorter: true
        },
        {
          title: '节点类型',
          dataIndex: 'nodeType',
          sorter: true
        },
        {
          title: '节点',
          dataIndex: 'node',
          sorter: true
        },
        {
          title: '域',
          dataIndex: 'region',
          sorter: true
        },
        {
          title: 'KPI名称',
          dataIndex: 'KPIName',
          sorter: true
        },
        {
          title: 'Alert名称',
          dataIndex: 'AlertName',
          sorter: true
        },
        {
          title: '级别',
          dataIndex: 'level',
          sorter: true
        },
        {
          title: '启用',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ],
      loadData: parameter => {
        // this.selectedRowKeys = []
        return getTRList(Object.assign(parameter, this.queryParam))
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
          },
          dblclick: () => {
            this.$refs.detail.open(record, 'See')
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
    }
  }
}
</script>

<style scoped>

</style>
