<template>
  <div class="ForwardRules">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="user_id"
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
        <a-button @click="onAddPersonalRule">新增</a-button>
        <a-button @click="onEditPersonalRule" :disabled="!hasSelectedOne">编辑</a-button>
        <a-button @click="onBatchDeletePersonalRules" :disabled="!hasSelected">删除</a-button>
        <a-button @click="onEditGlobalRule" class="fr" type="primary">全局告警通知设置</a-button>
      </template>
    </CTable>

    <GlobalRuleSchema />
    <PersonalRuleSchema />
  </div>
</template>

<script>
import { Confirm, List } from '@/components/Mixins'
import GlobalRuleSchema from './modules/GlobalRuleSchema'
import PersonalRuleSchema from './modules/PersonalRuleSchema'

export default {
  name: 'ForwardRules',
  mixins: [Confirm, List],
  components: {
    GlobalRuleSchema,
    PersonalRuleSchema
  },
  props: {},
  data: () => ({
    columns: Object.freeze([
      {
        title: '数据域',
        dataIndex: 'user_id',
        sorter: true,
        width: 180
      },
      {
        title: '监控类型',
        dataIndex: '2',
        sorter: true,
        width: 180
      },
      {
        title: '品牌名称',
        dataIndex: '23',
        sorter: true,
        width: 180
      },
      {
        title: '设备名称（IP）',
        dataIndex: '234',
        sorter: true,
        width: 180
      },
      {
        title: '检查项',
        dataIndex: '2345',
        sorter: true,
        width: 180
      },
      {
        title: '检查指标数量',
        dataIndex: '23456',
        sorter: true,
        width: 180
      },
      {
        title: '规则名称',
        dataIndex: '234567',
        sorter: true,
        width: 180
      },
      {
        title: '告警等级',
        dataIndex: '2345678',
        sorter: true,
        width: 180
      },
      {
        title: '通知方式',
        dataIndex: '23456789',
        sorter: true,
        width: 180
      },
      {
        title: '通知用户',
        dataIndex: '234567890',
        sorter: true,
        width: 180
      },
      {
        title: '更新时间',
        dataIndex: '23456789011',
        sorter: true,
        width: 180
      },
      {
        title: '启用状态',
        dataIndex: '2345678901112',
        sorter: true,
        width: 180
      }
    ])
  }),
  computed: {},
  methods: {
    loadData (parameter) {
      return {}
    },
    onAddPersonalRule () {},
    onDetail () {},
    onEditGlobalRule () {},
    onEditPersonalRule () {},
    onBatchDeletePersonalRules () {}
  }
}
</script>

<style lang="less">

</style>
