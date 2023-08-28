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
                  label="监控实体"
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

              <a-col v-bind="colProps">
                <a-form-item label="规则名称" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.title" />
                </a-form-item>
              </a-col>

              <a-col v-bind="colProps">
                <a-form-item label="启用状态" v-bind="formItemLayout" class="fw" v-action:M003004>
                  <a-select allowClear v-model.number="queryParams.enabled" >
                    <a-select-option :value="1">启用</a-select-option>
                    <a-select-option :value="0">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col v-bind="colProps">
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
        <a-button :disabled="!hasSelectedOne" @click="onDetail" v-action:M003005>查看</a-button>
        <a-button @click="onAdd" v-action:M003001>新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit" v-action:M003002>编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete" v-action:M003003>删除</a-button>
        <a-dropdown>
          <a-menu slot="overlay" @click="onEditGlobalRule">
            <a-menu-item key="merge">合并规则</a-menu-item>
            <a-menu-item key="upgrade">升级规则</a-menu-item>
            <a-menu-item key="recover">消除规则</a-menu-item>
            <a-menu-item key="forward">通知规则</a-menu-item>
          </a-menu>
          <a-button class="fr" type="primary"> 全局告警规则设置 <a-icon type="down" /> </a-button>
        </a-dropdown>
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

    <AlarmRuleGlobalSchema
      ref="global"
    />
  </div>
</template>

<script>
import QueryMixin from '../../queryMixin'
import { AlarmRuleService } from '@/api'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import { allRuleTypeMapping } from '@/tables/alarm_rule/types'
import RuleMixin from '../ruleMixin'
import {
  titleColumn,
  deviceTypeColumn,
  deviceBrandColumn,
  deviceModelColumn,
  endpointModelIdColumn,
  metricModelIdColumn,
  updateColumn,
  ruleTypeColumn,
  enabledColumn
} from '@/tables/alarm_rule/columns'

export default {
  name: 'AlarmsRules',
  mixins: [RuleMixin, QueryMixin],
  components: {},
  data () {
    return {
      allRuleType: Object.freeze(
        Object.fromEntries(allRuleTypeMapping)
      ),
      columns: [
        ...[
          titleColumn,
          deviceTypeColumn,
          deviceBrandColumn,
          deviceModelColumn,
          endpointModelIdColumn,
          metricModelIdColumn,
          updateColumn,
          ruleTypeColumn,
          enabledColumn
        ].map(fn => fn.call(this))
      ],
      queryParams: {
        rule_type: '',
        dictValue: [],
        endpoint_model_id: '',
        metric_model_id: ''
      }
    }
  },
  methods: {
    loadData (parameter) {
      const { enabled, dictValue, endpoint_model_id, metric_model_id, ...restQueryParams } = this.queryParams
      return AlarmRuleService.find({
        where: {
          ...generateQuery({
            ...restQueryParams,
            // https://github.com/vueComponent/ant-design-vue/issues/971
            ...enabled === undefined ? {} : { enabled: !!enabled }
          }),
          ...generateQuery({
            ...dictValue[2] ? {
              device_model: dictValue[2]
            } : {},
            endpoint_model_id,
            metric_model_id
          }, true),
          mode: 'personal'
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
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
    }
  }
}
</script>

<style scoped>
</style>
