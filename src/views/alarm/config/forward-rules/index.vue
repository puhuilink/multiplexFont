<template>
  <div class="ForwardRules">
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
                  label="关键字"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear placeholder="搜索设备名称、IP、规则名称" v-model.trim="queryParams.fuzz" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="监控对象"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
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
        <a-button @click="onDetail" :disabled="!hasSelectedOne">查看</a-button>
        <a-button @click="onAdd">新增</a-button>
        <a-button @click="onEdit" :disabled="!hasSelectedOne">编辑</a-button>
        <a-button @click="onBatchDelete" :disabled="!hasSelected">删除</a-button>
        <a-button @click="onEditGlobalRule" class="fr" type="primary">全局告警通知设置</a-button>
      </template>
    </CTable>

    <AlarmRuleSchema
      ref="schema"
      :ruleType="['forward']"
      @addSuccess="query"
      @editSuccess="query(false)"
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
import RuleMixin from '../ruleMixin'
import {
  deviceTypeColumn,
  deviceBrandColumn,
  deviceModelColumn,
  endpointModelIdColumn,
  metricModelIdColumn,
  updateColumn,
  enabledColumn
} from '@/composables/alarm-rule/columns'

export default {
  name: 'ForwardRules',
  mixins: [RuleMixin],
  components: {},
  props: {},
  data () {
    return {
      columns: [
        {
          title: '数据域',
          dataIndex: 'origin',
          sorter: true,
          width: 180
        },
        ...[
          deviceTypeColumn,
          deviceBrandColumn,
          deviceModelColumn,
          endpointModelIdColumn,
          metricModelIdColumn,
          updateColumn,
          enabledColumn
        ].map(fn => fn.call(this))
      // {
      //   title: '通知方式',
      //   dataIndex: '23456789',
      //   sorter: true,
      //   width: 180
      // },
      // {
      //   title: '通知用户',
      //   dataIndex: '234567890',
      //   sorter: true,
      //   width: 180
      // }
      ]
    }
  },
  computed: {},
  methods: {
    loadData (parameter) {
      return AlarmRuleService.find({
        where: generateQuery({
          mode: 'personal',
          rule_type: 'forward'
        }),
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        alias: 'data',
        ...parameter
      }).then(r => r.data)
    }
  }
}
</script>

<style lang="less">

</style>
