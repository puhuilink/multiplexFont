<template>
  <div class="plan-management">
    <a-card :borderd="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="巡检区域">
                <a-select
                  allowClear
                  v-model="queryParam.checkArea"
                  placeholder="请选择"
                  default-value="checkall"
                >
                  <a-select-option value="0">北京机房</a-select-option>
                  <a-select-option value="1">厦门机房</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="计划名称">
                <a-input v-model="queryParam.planName" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="执行小组">
                  <a-select
                    allowClear
                    v-model="queryParam.executiveGroup"
                    placeholder="请选择"
                    default-value="checkall"
                  >
                    <a-select-option value="0">超级管理员组</a-select-option>
                    <a-select-option value="1">服务管理流程组</a-select-option>
                    <a-select-option value="2">厦门监控组</a-select-option>
                    <a-select-option value="3">北京监控组</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="计划类型">
                  <a-select
                    allowClear
                    v-model="queryParam.planType"
                    placeholder="请选择"
                    default-value="checkall"
                  >
                    <a-select-option value="0">例行巡检</a-select-option>
                    <a-select-option value="1">临时巡检</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="是否启用">
                  <a-select
                    allowClear
                    v-model="queryParam.useing"
                    placeholder="请选择"
                    default-value="checkall"
                  >
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="计划编号">
                  <a-input v-model="queryParam.planCode" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="路线编号">
                  <a-input v-model="queryParam.routeCode" placeholder=""/>
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
        <a-button
          :disabled="selectedRowKeys.length !== 1"
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
        :scroll="{ y:400 }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
        <span slot="planCode" slot-scope="text">
          <ellipsis :length="10" tooltip >{{ text }}</ellipsis>
        </span>
      </s-table>
      <!-- E 列表 -->
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getPlan } from '@/api/patrol'
import deleteCheck from '@/components/DeleteCheck'

export default {
  name: 'Plan',
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
      // 告警列表表头
      columns: [
        {
          title: '巡检区域',
          dataIndex: 'checkArea',
          align: 'center',
          width: 120
        },
        {
          title: '计划名称',
          dataIndex: 'planName',
          align: 'center',
          width: 150,
          sorter: true
        },
        {
          title: '执行小组',
          dataIndex: 'executiveGroup',
          align: 'center',
          width: 150,
          sorter: true
        },
        {
          title: '计划类型',
          dataIndex: 'planType',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: '是否启用',
          dataIndex: 'useing',
          align: 'center',
          width: 150,
          sorter: true
        },
        {
          title: '计划编码',
          dataIndex: 'planCode',
          align: 'center',
          width: 150,
          sorter: true,
          scopedSlots: { customRender: 'planCode' }
        },
        {
          title: '相关路线编码',
          dataIndex: 'routeCode',
          sorter: true
        }
        // {
        //   title: '路线展示',
        //   dataIndex: 'way',
        //   scopedSlots: { customRender: 'way' }
        // }
      ],
      loadData: parameter => {
        // this.selectedRowKeys = []
        return getPlan(Object.assign(parameter, this.queryParam))
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
  filters: {},
  computed: {},
  methods: {
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * 日期时间空间选择
     */
    onDataChange (value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
    },
    onDataOk (value) {
      console.log('onOk: ', value)
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

<style scoped lang='less'>
.opration{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
</style>
