/**
* 视图列表
* Author: dong xing
* Date: 2019/12/5
* Time: 9:04 上午
* Email: dong.xing@outlook.com
*/
<template>
  <div class="view-list">
    <page-view>
      <a-card :bordered="false">

        <!-- S 搜索 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="advanced ? 12 : 8" :sm="24">
                <a-form-item label="视图ID">
                  <a-input v-model="queryParam.id" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="advanced ? 12 : 8" :sm="24">
                <a-form-item label="视图名称">
                  <a-input v-model="queryParam.name" placeholder=""/>
                </a-form-item>
              </a-col>
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item label="视图类型">
                    <a-select
                      mode="multiple"
                      v-model="queryParam.viewType"
                      placeholder=""
                    >
                      <a-select-option v-for="viewType in viewTypes" :key="viewType.value">
                        {{ viewType.label }}
                      </a-select-option>
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

        <!-- S 操作 -->
        <div class="table-operator">
          <a-button type="primary" icon="plus" @click="$refs.createModel.open()">新建</a-button>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" v-if="selectedRowKeys.length === 1" @click="handleEdit"><a-icon type="edit" />编辑</a-menu-item>
              <a-menu-item key="2" v-if="selectedRowKeys.length === 1" @click="handleCopy"><a-icon type="copy" />复制</a-menu-item>
              <a-menu-item key="3" v-if="selectedRowKeys.length === 1" @click="handleDesign"><a-icon type="highlight" />设计</a-menu-item>
              <a-menu-item key="4" @click="handleDelete"><a-icon type="delete" />删除</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              操作 <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <!-- E 操作 -->

        <!-- S 视图列表 -->
        <s-table
          ref="table"
          size="default"
          rowKey="key"
          :columns="columns"
          :data="loadData"
          :alert="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          showPagination="auto"
        />
        <!-- E 视图列表 -->

        <!-- S 创建视图 -->
        <create-view ref="createModel" @ok="() => $refs.table.refresh(true)" />
        <!-- E 创建视图 -->

      </a-card>
    </page-view>
  </div>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import { getViewList } from '@/api/view'
import CreateView from './modules/CreateView'

export default {
  name: 'ViewList',
  components: {
    PageView,
    STable,
    CreateView
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 视图类型
      viewTypes: [
        { label: '综合视图', value: 'comprehensive' },
        { label: '性能配置视图', value: 'performanceConfig' },
        { label: '拓扑视图', value: 'topology' },
        { label: '告警视图', value: 'alarm' },
        { label: '告警配置视图', value: 'alarmConfig' },
        { label: '性能监控视图', value: 'performanceMonitor' },
        { label: '三层架构视图', value: 'threeTierArchitecture' },
        { label: '第三方视图', value: 'thirdParty' },
        { label: '导航视图', value: 'navigation' },
        { label: '特殊视图', value: 'special' },
        { label: '报表视图', value: 'report' },
        { label: '插件视图', value: 'plugin' }
      ],
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '视图ID',
          dataIndex: 'id'
        },
        {
          title: '视图标题',
          dataIndex: 'title',
          sorter: true
        },
        {
          title: '视图类型',
          dataIndex: 'type',
          sorter: true
        },
        {
          title: '视图创建者',
          dataIndex: 'author',
          sorter: true
        },
        {
          title: '缩略图',
          dataIndex: 'thumbnail'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // 清空选中
        this.selectedRowKeys = []
        return getViewList(Object.assign(parameter, this.queryParam))
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
     * 重置搜索表单
     */
    resetSearchForm () {
      this.queryParam = {}
    },
    /**
     * 处理编辑事件
     */
    handleEdit () {
      console.log('Edit: ', this.selectedRows)
    },
    /**
     * 处理复制事件
     */
    handleCopy () {
      console.log('Copy: ', this.selectedRows)
    },
    /**
     * 处理设计事件
     */
    handleDesign () {
      const [ row ] = this.selectedRows
      const { id, title } = row
      this.$router.push({ name: 'Design', query: { id, title } })
    },
    /**
     * 处理删除事件
     */
    handleDelete () {
      console.log('Delete: ', this.selectedRows)
    }
  }
}
</script>
<style scoped lang="less">
</style>
