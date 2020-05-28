<template>
  <div class="baseline-policy">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="uuid"
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
                  label="策略名称"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.title" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="周期"
                  v-bind="formItemLayout"
                  style="width: 100%">
                  <a-input allowClear type="number" v-model.number="queryParams.cycle_count" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="计算时间"
                  v-bind="formItemLayout"
                  style="width: 100%">
                  <a-input allowClear v-model.trim="queryParams.cron_expression" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
            <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onAdd" v-action:M1301 >新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit" v-action:M1302 >编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete" v-action:M1303 >删除</a-button>
      </template>
    </CTable>

    <detail
      ref="detail"
      @addSuccess="query"
      @editSuccess="query(false)"
    ></detail>
  </div>
</template>

<script>
import detail from '../modules/BSDetail'
import { queryBaselineList, deleteBaselinePolicies } from '@/api/controller/BaselinePolicy'
import { Confirm, List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'

export default {
  name: 'BaselinePolicy',
  mixins: [Confirm, List],
  components: {
    detail
  },
  data: () => ({
    columns: [
      {
        title: '策略名称',
        dataIndex: 'title',
        sorter: true,
        width: 150,
        tooltip: true
      },
      {
        title: '周期',
        dataIndex: 'cycle_count',
        width: 150,
        sorter: true,
        tooltip: true
      },
      {
        title: '时间步长',
        dataIndex: 'cal_interval',
        width: 200,
        sorter: true,
        tooltip: true
      },
      {
        title: '样本密集区域',
        dataIndex: 'sample_radio',
        width: 250,
        sorter: true,
        tooltip: true
      },
      {
        title: '计算时间',
        dataIndex: 'cron_expression',
        width: 180,
        sorter: true
      }
    ]
  }),
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      return queryBaselineList({
        ...parameter,
        where: {
          ...generateQuery(this.queryParams)
        }
      }).then(r => r.data)
    },
    /**
     * 新增动态基线策略
     * @event
     */
    onAdd () {
      this.$refs['detail'].open({}, 'Add')
    },
    /**
     * 编辑动态基线策略
     * @event
     */
    onEdit () {
      const [record] = this.selectedRows
      this.$refs['detail'].open({ ...record }, 'Edit')
    },
    /**
     * 批量删除动态基线策略
     * @event
     */
    async onBatchDelete () {
      this.$confirmDelete({
        onOk: () => deleteBaselinePolicies(this.selectedRowKeys)
          .then(() => {
            this.notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.notifyError)
      })
    }
  }
}
</script>

<style lang='less'>
</style>
