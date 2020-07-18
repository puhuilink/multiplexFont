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
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-select v-model="queryParams.rule_type" @change="query">
          <a-select-option
            v-for="(label, value) in allRuleType"
            :key="value"
            :value="value"
          >{{ label }}</a-select-option>
        </a-select>
        &nbsp;&nbsp;
        <a-button @click="onAdd" v-action:M0301>新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit" v-action:M0302>编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete" v-action:M0303>删除</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchToggleEnabled(true)" v-action:M0304>启用</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchToggleEnabled(false)" v-action:M0304>停用</a-button>
      </template>
    </CTable>

    <AlarmRuleSchema
      @addSuccess="query"
      @editSuccess="query(false)"
      ref="schema"
    />
  </div>
</template>

<script>
import { Confirm, List } from '@/components/Mixins'
import { AlarmRuleService } from '@/api-hasura/index'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import { ruleTypeMapping, allRuleTypeMapping } from './typing'
import AlarmRuleSchema from './modules/AlarmRuleSchema/index'

export default {
  name: 'AlarmsRules',
  mixins: [Confirm, List],
  components: {
    AlarmRuleSchema
  },
  data: () => ({
    allRuleType: Object.freeze(
      Object.fromEntries(allRuleTypeMapping)
    ),
    columns: Object.freeze([
      {
        title: '规则名称',
        dataIndex: 'title',
        width: 200,
        sorter: true
      },
      {
        title: '规则类型',
        dataIndex: 'rule_type',
        width: 200,
        sorter: true,
        customRender: ruleType => ruleTypeMapping.get(ruleType)
      },
      // {
      //   title: '数据域',
      //   dataIndex: 'rule_type',
      //   width: 200,
      //   sorter: true
      // },
      {
        title: '设备名称',
        dataIndex: 'host_id',
        width: 200,
        sorter: true
      },
      {
        title: '监控实体',
        dataIndex: 'metric_id',
        width: 200,
        sorter: true
      },
      {
        title: '检查项',
        dataIndex: 'endpoint_id',
        width: 200,
        sorter: true
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        width: 200,
        sorter: true
      },
      {
        title: '启用状态',
        dataIndex: 'enabled',
        width: 200,
        sorter: true,
        customRender: enabled => enabled ? '是' : '否'
      }
    ]),
    queryParams: {
      rule_type: ''
    }
  }),
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
          .batchDelete(this.selectedRows)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    },
    async onBatchToggleEnabled (value) {
      this.$promiseConfirm({
        title: '系统提示',
        content: value ? '是否启用选中规则？' : '是否停用选中规则？',
        onOk: () => AlarmRuleService[value ? 'batchEnabled' : 'batchDisabled'](this.selectedRowKeys)
          .then(() => {
            this.$notification.success({
              message: '系统提示',
              description: value ? '规则启用成功' : '规则停用成功'
            })
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    },
    onEdit () {
      const [id] = this.selectedRowKeys
      this.$refs.schema.edit(id)
    },
    resetQueryParams () {
      const { queryParams: { rule_type } } = this
      this.$data.queryParams = Object.assign({}, this.$options.data.apply(this).queryParams, rule_type)
    }
  }
}
</script>

<style scoped>

</style>
