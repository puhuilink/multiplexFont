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
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="视图ID"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input-number class="fw" allowClear v-model.number="queryParams.view_id" />
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item
                  label="视图标题"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.view_title" />
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item
                  label="视图类型"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select allowClear v-model="queryParams.view_type">
                    <a-select-option :value="VIEW_TYPE.template">{{ VIEW_TYPE_MAPPING.get(VIEW_TYPE.template) }}</a-select-option>
                    <a-select-option :value="VIEW_TYPE.instance">{{ VIEW_TYPE_MAPPING.get(VIEW_TYPE.instance) }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button v-action:M0201 @click="handleAdd">新增</a-button>
        <a-button :disabled="!hasSelectedOne" v-action:M0202 @click="handleEdit">编辑</a-button>
        <a-button :disabled="!hasSelectedOne" :loading="copyLoading" v-action:M0202 @click="handleCopy">复制</a-button>
        <a-button :disabled="!hasSelectedOne" v-action:M0203 @click="handleDesign">设计</a-button>
        <a-button :disabled="!hasSelected" v-action:M0204 @click="handleDelete">删除</a-button>
      </template>
    </CTable>

    <ViewSchema
      ref="title"
      v-action:M0202
      @addSuccess="query"
      @editSuccess="query"
    />
  </div>
</template>

<script>
import ViewSchema from './modules/ViewSchema'
import { Confirm, List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import { ViewListService } from '@/api'
import { VIEW_TYPE } from '@/tables/view/enum'
import { VIEW_TYPE_MAPPING } from '@/tables/view/types'

export default {
  name: 'ViewList',
  mixins: [Confirm, List],
  components: {
    ViewSchema
  },
  data () {
    return {
      copyLoading: false,
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
          title: '视图类型',
          dataIndex: 'view_type',
          sorter: true,
          width: 300,
          customRender: (view_type) => VIEW_TYPE_MAPPING.get(view_type)
        },
        {
          title: '视图创建者',
          dataIndex: 'creator',
          width: 200,
          customRender: (creator, { user }) => user ? user.staff_name : creator
        },
        {
          title: '缩略图',
          dataIndex: 'view_img',
          width: 400,
          tooltip: true,
          customRender: (src) => src ? <a href={`${process.env.VUE_APP_VIEW_THUMBNAIL_URI}/${src}`} target="_blank">{ src }</a> : ''
        }
      ],
      VIEW_TYPE,
      VIEW_TYPE_MAPPING
    }
  },
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      return ViewListService.find({
        where: {
          ...generateQuery(this.queryParams)
        },
        fields: [
          ...this.columns.map(({ dataIndex }) => dataIndex),
          'user { staff_name }'
        ],
        ...parameter,
        alias: 'data'
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
        await ViewListService.copy(viewId)
        this.$notification.success({
          message: '系统提示',
          description: '复制成功'
        })
        this.$refs['table'].refresh()
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
