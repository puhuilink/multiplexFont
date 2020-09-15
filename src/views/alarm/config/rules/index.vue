<template>
  <div class="alarms-rules">
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
                <a-form-item label="规则名称" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.title" />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item label="状态" v-bind="formItemLayout" class="fw">
                  <a-select allowClear v-model.number="queryParams.enabled" >
                    <a-select-option :value="1">启用</a-select-option>
                    <a-select-option :value="0">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="规则类型"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select v-model="queryParams.rule_type">
                    <a-select-option
                      v-for="(label, value) in allRuleType"
                      :key="value"
                      :value="value"
                    >{{ label }}</a-select-option>
                  </a-select>
                </a-form-item></a-col>
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
        <a-button :disabled="!hasSelectedOne" @click="onDetail">查看</a-button>
        <a-button @click="onAdd" v-action:M0301>新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit" v-action:M0302>编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete" v-action:M0303>删除</a-button>
        <!-- <a-button :disabled="!hasSelected" @click="onBatchToggleEnabled(true)" v-action:M0304>启用</a-button> -->
        <!-- <a-button :disabled="!hasSelected" @click="onBatchToggleEnabled(false)" v-action:M0304>停用</a-button> -->
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

    <AlarmRuleSchema
      @addSuccess="query"
      @editSuccess="query(false)"
      ref="schema"
    />

    <AlarmRuleDetailSchema
      ref="detail"
    />
  </div>
</template>

<script>
import { Confirm, List } from '@/components/Mixins'
import { AlarmRuleService } from '@/api-hasura/index'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import { ruleTypeMapping, allRuleTypeMapping } from '../typing'
import AlarmRuleSchema from '../modules/AlarmRuleSchema/index'
import AlarmRuleDetailSchema from '../modules/AlarmRuleDetailSchema/index'
import moment from 'moment'

export default {
  name: 'AlarmsRules',
  mixins: [Confirm, List],
  components: {
    AlarmRuleSchema,
    AlarmRuleDetailSchema
  },
  data () {
    return {
      allRuleType: Object.freeze(
        Object.fromEntries(allRuleTypeMapping)
      ),
      columns: Object.freeze([
        {
          title: '规则名称',
          dataIndex: 'title',
          width: 280,
          sorter: true,
          fixed: 'left'
        },
        {
          title: '监控类型',
          dataIndex: 'device_type',
          width: 200,
          sorter: true
        },
        {
          title: '品牌名称',
          dataIndex: 'device_brand',
          width: 200,
          sorter: true
        },
        {
          title: '品牌设备',
          dataIndex: 'device_model',
          width: 200,
          sorter: true
        },
        {
          title: '监控实体',
          dataIndex: 'metric_model_id modelMetric { alias }',
          width: 200,
          customRender: (metricModelId, { modelMetric }) => _.get(modelMetric, 'alias') || metricModelId
        },
        {
          title: '检查项',
          dataIndex: 'endpoint_model_id modelEndpoint { alias }',
          width: 200,
          customRender: (endpointModelId, { modelEndpoint }) => _.get(modelEndpoint, 'alias') || endpointModelId
        },
        {
          title: '规则类型',
          dataIndex: 'rule_type',
          width: 100,
          sorter: true,
          customRender: ruleType => ruleTypeMapping.get(ruleType)
        },
        {
          title: '更新时间',
          dataIndex: 'update_time',
          width: 200,
          sorter: true,
          customRender: time => time ? moment(time).format() : ''
        },
        {
          title: '启用状态',
          dataIndex: 'enabled',
          width: 100,
          sorter: true,
          scopedSlots: {
            customRender: 'enabled'
          },
          fixed: 'right'
        }
      ]),
      queryParams: {
        rule_type: ''
      }
    }
  },
  methods: {
    loadData (parameter) {
      const { enabled, ...restQueryParams } = this.queryParams
      return AlarmRuleService.find({
        where: {
          ...generateQuery({
            ...restQueryParams,
            // https://github.com/vueComponent/ant-design-vue/issues/971
            ...enabled === undefined ? {} : { enabled: !!enabled }
          })
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
        onOk: () => AlarmRuleService
          .batchDelete(this.selectedRowKeys)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    },
    onDetail () {
      const [id] = this.selectedRowKeys
      this.$refs['detail'].detail(id)
    },
    async onToggleEnabled (id, enabled) {
      try {
        this.$refs['table'].loading = true
        //
        await AlarmRuleService.batchToggleEnabled([id], enabled)
      } catch (e) {
        throw e
      } finally {
        this.query(false)
      }
    },
    onEdit () {
      const [id] = this.selectedRowKeys
      this.$refs.schema.edit(id)
    }
  }
}
</script>

<style scoped>

</style>
