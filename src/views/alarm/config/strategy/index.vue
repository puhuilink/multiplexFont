<template>
  <div class="AlarmStrategy">
    <a-tabs :activeKey="mode" @change="onToggleMode">
      <a-tab-pane :key="STRATEGY_MODE.personal" tab="自定义阈值"></a-tab-pane>
      <a-tab-pane :key="STRATEGY_MODE.common" tab="默认阈值"></a-tab-pane>
    </a-tabs>

    <CTable
      :columns="mode === STRATEGY_MODE.personal ? columns : modelColumns"
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
              <a-col v-bind="colProps">
                <a-form-item
                  label="品牌设备"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <CascaderDictValue
                    :value="queryParams.dictValue"
                    @change="onChangDictValue"
                  />
                </a-form-item>
              </a-col>

              <a-col v-bind="colProps">
                <a-form-item
                  label="检查实体"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <EndpointSelect
                    schema="model"
                    :parentId="queryParams.dictValue[2]"
                    :value="queryParams.endpoint_model_id"
                    @update:value="onChangeEndpointModelId($event)"
                  />
                </a-form-item>
              </a-col>

              <a-col v-bind="colProps">
                <a-form-item
                  label="检查项"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <MetricSelect
                    schema="model"
                    :parentId="queryParams.endpoint_model_id"
                    :value="queryParams.metric_model_id"
                    @update:value="onChangeMetricModelId($event)"
                  />
                </a-form-item>
              </a-col>
              <a-col v-bind="colProps" v-if="mode === 'personal'">
                <a-form-item
                  label="阈值名称"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.name" />
                </a-form-item>
              </a-col>
              <a-col v-bind="colProps" v-if="mode === 'personal'">
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
            <!-- <ToggleBtn @click="toggleAdvanced" :advanced="advanced" /> -->
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onDetail" :disabled="!hasSelectedOne" v-action:M003014>查看</a-button>
        <a-button @click="onAdd" v-show="mode === STRATEGY_MODE.personal" v-action:M003015>新建</a-button>
        <a-button @click="onEdit" :disabled="!hasSelectedOne" v-show="mode === STRATEGY_MODE.personal" v-action:M003016>编辑</a-button>
        <a-button @click="onBatchDelete" :disabled="!hasSelected" v-show="mode === STRATEGY_MODE.personal" v-action:M003017>删除</a-button>
      </template>

      <template v-slot:enabled="enabled, { id }">
        <a-popconfirm
          v-if="mode === STRATEGY_MODE.personal"
          v-action:M003004
          :title="`确定要更改${enabled ? '启用' : '停用'}状态吗？`"
          @confirm="onToggleEnabled(id, !enabled)"
          okText="提交"
          cancelText="取消">
          <a-button :type="enabled ? 'primary' : 'default'">{{ enabled ? '启用' : '停用' }}</a-button>
        </a-popconfirm>
        <!-- <a-button v-else :type="enabled ? 'primary' : 'default'">{{ enabled ? '启用' : '停用' }}</a-button> -->
        <span v-else>{{ enabled ? '启用' : '停用' }}</span>
      </template>
    </CTable>

    <AlarmStrategySchema
      @addSuccess="query"
      @editSuccess="query(false)"
      :mode="mode"
      ref="schema"
    />
  </div>
</template>

<script>
import { List } from '@/components/Mixins'
import QueryMixin from '../../queryMixin'
import { StrategyService } from '@/api'
import { generateQuery } from '@/utils/graphql'
import AlarmStrategySchema from '../modules/AlarmStrategySchema/index'
import _ from 'lodash'
import {
  deviceTypeColumn,
  deviceBrandColumn,
  deviceModelColumn,
  endpointModelIdColumn,
  metricModelIdColumn,
  modelTypeColumn,
  modelDeviceBrandColumn,
  modelEndpointModelIdColumn,
  metricModelColumn,
  hostModelType
} from '@/tables/alarm_rule/columns'
import {
  nameColumn
} from '@/tables/cmdb_strategy/columns'
import { STRATEGY_MODE } from '@/tables/cmdb_strategy/enum'

export default {
  name: 'AlarmStrategy',
  mixins: [List, QueryMixin],
  components: {
    AlarmStrategySchema
  },
  props: {},
  data () {
    return {
      STRATEGY_MODE,
      mode: STRATEGY_MODE.personal,
      columns: [
        ...[
          nameColumn,
          deviceTypeColumn,
          deviceBrandColumn,
          deviceModelColumn,
          endpointModelIdColumn,
          metricModelIdColumn
        ].map(fn => fn.call(this)),
        {
          title: '更新时间',
          dataIndex: 'last_update_time',
          width: 300,
          sorter: true,
          orderBy: 'descend'
        }
      ],
      modelColumns: [
        ...[
          modelTypeColumn,
          modelDeviceBrandColumn,
          hostModelType,
          modelEndpointModelIdColumn,
          metricModelColumn
        ].map(fn => fn.call(this))
      ],
      queryParams: {
        dictValue: [],
        endpoint_model_id: '',
        metric_model_id: ''
      }
    }
  },
  computed: {
    scrollY () {
      return 'max(calc(100vh - 410px), 100px)'
    }
  },
  methods: {
    loadData (parameter) {
      const { dictValue, endpoint_model_id, metric_model_id, ...restQueryParams } = this.queryParams
      if (this.mode === 'common') {
        return StrategyService.modelFind({
          where: {
            ...dictValue[2] ? {
              model: { device_model_value_code: { _eq: dictValue[2] } }
            } : {},
            ...endpoint_model_id ? {
              model: { endpint_id: { _eq: endpoint_model_id } }
            } : {},
            ...generateQuery({ metric_id: metric_model_id }, true),
            ...generateQuery(restQueryParams)
          },
          fields: _.uniq(['id', ...this.modelColumns.map(({ dataIndex }) => dataIndex)]),
          alias: 'data',
          ...parameter
        }).then(r => r.data)
      } else {
        return StrategyService.find({
          where: {
            ...generateQuery(restQueryParams),
            ...generateQuery({
              ...dictValue[2] ? {
                device_model: dictValue[2]
              } : {},
              endpoint_model_id,
              metric_model_id
            }, true)
          },
          fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
          ...parameter,
          alias: 'data'
        }).then(r => r.data)
      }
    },
    /**
     * 新增阈值规则
     */
    onAdd () {
      this.$refs.schema.add()
    },
    onChangDictValue (dictValue) {
      this.queryParams.dictValue = dictValue
      this.onChangeEndpointModelId()
    },
    onChangeEndpointModelId (endpointModelId) {
      this.queryParams.endpoint_model_id = endpointModelId
      this.onChangeMetricModelId()
    },
    onChangeMetricModelId (metricModelId) {
      this.queryParams.metric_model_id = metricModelId
    },
    /**
     * 阈值规则详情
     */
    onDetail () {
      const [id] = this.selectedRowKeys
      if (this.mode === STRATEGY_MODE.personal) {
        this.$refs.schema.detail(id)
      } else {
        this.$refs.schema.modelDetail(id)
      }
    },
    /**
     * (批量删除)阈值规则
     */
    async onBatchDelete () {
      this.$promiseConfirmDelete({
        onOk: async () => {
          try {
            await StrategyService.batchDelete(this.selectedRowKeys)
            this.$notifyDeleteSuccess()
            this.query(false)
          } catch (e) {
            this.$notification.error({
              message: '删除失败',
              description: e.toString() })
            throw e
          }
        }
      })
    },
    /**
     * 编辑（自定义）阈值规则
     */
    onEdit () {
      const [id] = this.selectedRowKeys
      this.$refs.schema.edit(id)
    },
    /**
     * (批量)开启/关闭阈值规则
     */
    async onToggleEnabled (id, enabled) {
      try {
        this.$refs['table'].loading = true
        await StrategyService.batchToggleEnabled(id, enabled)
        await this.query(false)
      } finally {
        this.$refs['table'].loading = false
      }
    },
    /**
     * 切换阈值规则类型
     */
    onToggleMode (mode) {
      this.mode = mode
      this.query()
    }
  }
}
</script>

<style lang="less">

</style>
