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
        <a-dropdown>
          <a-menu slot="overlay" @click="onEditGlobalRule">
            <a-menu-item key="merge">合并规则</a-menu-item>
            <a-menu-item key="upgrade">升级规则</a-menu-item>
            <a-menu-item key="recover">消除规则</a-menu-item>
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
  mixins: [RuleMixin],
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
          }),
          mode: 'personal'
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    }
  }
}
</script>

<style scoped>
</style>
