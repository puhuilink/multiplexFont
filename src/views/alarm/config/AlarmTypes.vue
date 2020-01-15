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
                <a-input v-model="queryParam.showName" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属节点类型">
                <a-input v-model="queryParam.type" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="告警编码">
                  <a-input v-model="queryParam.type" placeholder=""/>
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
      />
      <!-- E 列表 -->

      <!-- S 模块 -->
      <detail ref="detail"></detail>
      <!-- E 模块 -->
    </a-card>

  </div>
</template>

<script>
import { STable } from '@/components'
import { getalarmTypeList } from '@/api/alarmType'
import deleteCheck from '@/components/DeleteCheck'
import detail from './modules/alarmTypesDetail'

export default {
  name: 'AlarmsTypes',
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
      columns: [
        {
          title: '更新时间',
          dataIndex: 'turnoverTime',
          sorter: true
        },
        {
          title: '名称',
          dataIndex: 'name',
          sorter: true
        },
        {
          title: '显示名称',
          dataIndex: 'showName',
          sorter: true
        },
        {
          title: '图标',
          dataIndex: 'showIcon',
          sorter: true
        },
        {
          title: '数据权限域',
          dataIndex: 'DPFiled',
          sorter: true
        },
        {
          title: '告警编码',
          dataIndex: 'alarmCode',
          sorter: true
        },
        {
          title: '所属模型',
          dataIndex: 'mid',
          sorter: true
        }
      ],
      loadData: parameter => {
        // this.selectedRowKeys = []
        return getalarmTypeList(Object.assign(parameter, this.queryParam))
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
