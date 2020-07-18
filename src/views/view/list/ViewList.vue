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
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="view_id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="视图ID"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input-number class="fw" allowClear v-model.number="queryParams.view_id" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="视图标题"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.view_title" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
            <!-- <ToggleBtn @click="toggleAdvanced" :advanced="advanced" /> -->
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="handleAdd" v-action:M0201>新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="handleEdit" v-action:M0202>编辑</a-button>
        <a-button :disabled="!hasSelectedOne" @click="handleCopy" :loading="copyLoading" v-action:M0202>复制</a-button>
        <a-button :disabled="!hasSelectedOne" @click="handleDesign" v-action:M0203>设计</a-button>
        <a-button @click="handleDelete" :disabled="!hasSelected" v-action:M0204>删除</a-button>
      </template>
    </CTable>

    <ViewTitleSchema
      ref="title"
      @addSuccess="query"
      @editSuccess="query"
    />
  </div>
</template>

<script>
import { getViewList, copyView } from '@/api/controller/View'
import ViewTitleSchema from './ViewTitleSchema'
import { Confirm, List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import { ViewListService } from '@/api-hasura'

export default {
  name: 'ViewList',
  mixins: [Confirm, List],
  components: {
    ViewTitleSchema
  },
  data: () => ({
    // 复制按钮 loading
    copyLoading: false,
    // 视图类型
    viewTypes: [
      // 此处为老系统分类列表，已 deprecated
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
    columns: [
      {
        title: '视图ID',
        dataIndex: 'view_id',
        sorter: true,
        width: 100
      },
      {
        title: '视图标题',
        dataIndex: 'view_title',
        sorter: true,
        width: 300,
        tooltip: true
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
        tooltip: true
      }
    ]
  }),
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      return getViewList({
        ...parameter,
        where: {
          ...generateQuery(this.queryParams),
          // 老系统才区分视图类型，新系统只有一种类型
          view_type: {
            _eq: 'h5'
          }
        }
      }).then(r => r.data)
    },
    /**
     * 处理新增事件
     */
    handleAdd () {
      this.$refs['title'].add()
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
      this.$promiseConfirmDelete({
        onOk: () => ViewListService.batchDelete(this.selectedRowKeys)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    }
  }
}
</script>

<style lang="less">
</style>
