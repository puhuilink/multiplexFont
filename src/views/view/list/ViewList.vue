/**
* 视图列表
* Author: dong xing
* Date: 2019/12/5
* Time: 9:04 上午
* Email: dong.xing@outlook.com
*/
<template>
  <div class="view-list">
    <CTable
      ref="table"
      rowKey="view_id"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :scroll="{ x: scrollX, y: `calc(100vh - 300px)` }"
    >
      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="视图ID"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model.number="queryParams.view_id" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="视图标题"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.view_title" placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
            <!--                      <a @click="toggleAdvanced" style="margin-left: 8px">-->
            <!--                        {{ advanced ? '收起' : '展开' }}-->
            <!--                        <a-icon :type="advanced ? 'up' : 'down'"/>-->
            <!--                      </a>-->
          </span>
        </a-form>
      </template>

      <template #operation>
        <a-button @click="$refs['title'].add()">新建</a-button>
        <a-button :disabled="selectedRowKeys.length !== 1" @click="handleEdit">编辑</a-button>
        <a-button :disabled="selectedRowKeys.length !== 1" @click="handleCopy" :loading="copyLoading">复制</a-button>
        <a-button :disabled="selectedRowKeys.length !== 1" @click="handleDesign">设计</a-button>
        <a-button @click="handleDelete" :disabled="selectedRowKeys.length === 0">删除</a-button>
      </template>

      <span slot="viewTitle" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="viewName" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="img" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
    </CTable>

    <!-- S 创建视图 -->
    <create-view ref="createModel" @ok="() => $refs.table.refresh(true)" />
    <!-- E 创建视图 -->

    <ViewTitleScheme
      ref="title"
      @editSuccess="$refs['table'].refresh(false)"
      @addSuccess="() => { this.queryParams = {}; this.$refs['table'].refresh(true) }"
    />
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import { PageView } from '@/layouts'
import { getViewList, copyView, deleteViews } from '@/api/controller/View'
import CreateView from './modules/CreateView'
import ViewTitleScheme from './ViewTitleScheme'
import Template from '../../design/modules/template/index'
import { Ellipsis } from '@/components'
import deleteCheck from '@/components/DeleteCheck'

export default {
  name: 'ViewList',
  components: {
    Template,
    PageView,
    CTable,
    CreateView,
    ViewTitleScheme,
    Ellipsis
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 复制按钮 loading
      copyLoading: false,
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
      queryParams: {},
      // 表头
      columns: [
        {
          title: '视图ID',
          dataIndex: 'view_id',
          sorter: true,
          // fixed: 'left',
          width: 100
        },
        {
          title: '视图标题',
          dataIndex: 'view_title',
          sorter: true,
          width: 300,
          scopedSlots: { customRender: 'viewTitle' }
        },
        {
          title: '视图名称',
          dataIndex: 'view_name',
          sorter: true,
          width: 300,
          scopedSlots: { customRender: 'viewName' }
        },
        {
          title: '视图创建者',
          dataIndex: 'creator',
          sorter: true,
          width: 200
        },
        {
          title: '缩略图',
          dataIndex: 'view_img',
          width: 400,
          scopedSlots: { customRender: 'img' }
        }
      ],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  computed: {
    scrollX: {
      get () {
        // 选择框宽度 36
        return this.columns.map(e => e.width).reduce((x1, x2) => (x1 + x2)) + 36
      }
    }
  },
  methods: {
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    loadData (parameter) {
      this.selectedRowKeys = []
      this.selectedRows = []
      return getViewList({
        ...parameter,
        where: {
          ...this.queryParams.view_id !== undefined && this.queryParams.view_id !== '' ? {
            view_id: {
              // TODO: 表单 input 强转换
              _eq: Number(this.queryParams.view_id)
            }
          } : {},
          ...this.queryParams.view_title !== undefined ? {
            view_title: {
              _ilike: `%${this.queryParams.view_title.trim()}%`
            }
          } : {},
          // 老系统才区分视图类型，新系统只有一种类型
          view_type: {
            _eq: 'h5'
          }
        }
      }).then(r => r.data)
    },
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
    query (firstPage = true) {
      this.$refs['table'].refresh(firstPage)
    },
    /**
     * 重置搜索表单
     */
    resetSearchForm () {
      this.queryParams = {}
    },
    /**
     * 处理编辑事件
     */
    handleEdit () {
      const [record] = this.selectedRows
      this.$refs['title'].edit(record)
    },
    /**
     * 处理复制事件
     */
    async handleCopy () {
      // console.log('Copy: ', this.selectedRows)
      const [viewId] = this.selectedRowKeys
      try {
        this.copyLoading = true
        await copyView(viewId)
        this.$notification.success({
          message: '系统提示',
          description: '复制成功'
        })
        this.$refs['table'].refresh()
      } catch (e) {
        throw e
      } finally {
        this.copyLoading = false
      }
    },
    /**
     * 处理设计事件
     */
    handleDesign () {
      const [ row ] = this.selectedRows
      const { view_id: id, view_title: title } = row
      this.$router.push({ name: 'Design', query: { id, title } })
    },
    /**
     * 处理删除事件
     */
    async handleDelete () {
      // console.log('Delete: ', this.selectedRows)
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.loading = false
        await deleteViews(this.selectedRowKeys)
        this.$notification.success({
          message: '系统提示',
          description: '删除成功'
        })
        // refresh 后会自动结束 loading
        this.$refs['table'].refresh()
      } catch (e) {
        this.loading = false
        throw e
      }
    }
  }
}
</script>
<style scoped lang="less">
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
