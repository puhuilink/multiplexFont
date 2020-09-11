<template>
  <div class="AlarmStrategy">
    <a-tabs :activeKey="tabIndex" @change="onTabChange">
      <a-tab-pane key="personal" tab="自定义阈值"></a-tab-pane>
      <a-tab-pane key="common" tab="默认阈值"></a-tab-pane>
    </a-tabs>

    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
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
                  label="阈值名称"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.name" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="启用状态"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select v-model="queryParams.enabled" allowClear>
                    <a-select-option :value="1">是</a-select-option>
                    <a-select-option :value="0">否</a-select-option>
                  </a-select>
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
        <a-button @click="onAdd">新建</a-button>
        <a-button @click="onEdit" :disabled="!hasSelectedOne">编辑</a-button>
        <a-button @click="onBatchDelete" :disabled="!hasSelected">删除</a-button>
      </template>

      <template v-slot:enabled="enabled, { id }">
        <a-popconfirm
          v-action:M0304
          :title="`确定要更改${enabled ? '启用' : '停用'}状态吗？`"
          @confirm="onToggleEnabled(id, !enabled)"
          okText="确定"
          cancelText="取消">
          <a-button :type="enabled ? 'primary' : 'default'">{{ enabled ? '启用' : '停用' }}</a-button>
        </a-popconfirm>
      </template>
    </CTable>

    <AlarmStrategySchema
      @addSuccess="query"
      @editSuccess="query(false)"
      ref="schema"
    />
  </div>
</template>

<script>
import { List } from '@/components/Mixins'
import { StrategyService } from '@/api-hasura/index'
import { generateQuery } from '@/utils/graphql'
import AlarmStrategySchema from '../modules/AlarmStrategySchema/index'
import _ from 'lodash'

export default {
  name: 'AlarmStrategy',
  mixins: [List],
  components: {
    AlarmStrategySchema
  },
  props: {},
  data: () => ({
    tabIndex: 'personal',
    columns: [
      {
        title: '阈值名称',
        dataIndex: 'name',
        width: 200,
        sorter: true
      },
      // {
      //   title: '数据域',
      //   dataIndex: 'alarm_level',
      //   width: 200,
      //   sorter: true,
      // show: true
      // },
      {
        title: '监控设备',
        dataIndex: 'host_id',
        width: 200
      },
      {
        title: '监控类型',
        dataIndex: 'device_type',
        width: 200
      },
      {
        title: '品牌名称',
        dataIndex: 'device_brand',
        width: 200
      },
      {
        title: '品牌设备',
        dataIndex: 'device_model',
        width: 200
      },
      // {
      //   title: '监控实例',
      //   dataIndex: 'metric_id',
      //   width: 200
      // },
      // {
      //   title: '检查项',
      //   dataIndex: 'endpoint_id',
      //   width: 200
      // },
      {
        title: '更新时间',
        dataIndex: 'last_update_time',
        width: 200,
        sorter: true
      },
      {
        title: '启用状态',
        dataIndex: 'enabled',
        width: 200,
        sorter: true,
        scopedSlots: {
          customRender: 'enabled'
        }
      }
    ]
  }),
  computed: {},
  methods: {
    loadData (parameter) {
      return StrategyService.find({
        where: {
          ...generateQuery(this.queryParams),
          mode: this.tabIndex
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    onAdd () {
      this.$refs.schema.add()
    },
    async onBatchDelete () {
      this.$promiseConfirmDelete({
        onOk: () => StrategyService
          .batchDelete(this.selectedRows)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    },
    async onToggleEnabled (id, enabled) {
      try {
        this.$refs['table'].loading = true
        //
        await StrategyService.batchToggleEnabled([id], enabled)
      } catch (e) {
        throw e
      } finally {
        this.query(false)
      }
    },
    onEdit () {
      const [id] = this.selectedRowKeys
      this.$refs.schema.edit(id)
    },
    onTabChange (tabIndex) {
      this.tabIndex = tabIndex
      this.query()
    }
  }
}
</script>

<style lang="less">

</style>
