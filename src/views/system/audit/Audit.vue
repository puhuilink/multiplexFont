<template>
  <div class="audit">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="audit_id"
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
                  label="模块名称"
                  v-bind="formItemLatout"
                  style="width: 100%"
                >
                  <a-input v-model.trim="queryParams.module_name" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="操作账号"
                  v-bind="formItemLatout"
                  style="width: 100%"
                >
                  <a-input v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <!-- 多余筛选框是否展示 -->
            </a-row>
            <div v-show="advanced">
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="功能名称"
                    v-bind="formItemLatout"
                    style="width: 100%"
                  >
                    <a-input v-model.trim="queryParams.actionname" />
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="客户端IP"
                    v-bind="formItemLatout"
                    style="width: 100%"
                  >
                    <a-input v-model.trim="queryParams.client_ip" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="时间范围"
                    v-bind="formItemLatout"
                    style="width: 100%"
                  >
                    <a-range-picker
                      allowClear
                      format="YYYY-MM-DD HH:mm:ss"
                      :placeholder="['开始时间', '结束时间']"
                      :showTime="{ format: 'HH:mm:ss' }"
                      style="width: 100%"
                      v-model="queryParams.operation_time"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" :disabled="disabledQuery" />
            <ResetBtn @click="resetQueryParams" />
            <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onShow" :disabled="!hasSelectedOne">查看</a-button>
      </template>
    </CTable>

    <AuditSchema
      ref="schema"
    />
  </div>
</template>

<script>
import AuditSchema from './AuditSchema'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import { generateQuery } from '@/utils/graphql'
import List from '@/components/Mixins/Table/List'

const query = gql`query ($where: t_audit_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [t_audit_order_by!]) {
    pagination: t_audit_aggregate(where: $where) {
    aggregate {
    count
    }
    }
    data: t_audit(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    audit_id
    module_name
    user_id
    actionname
    client_ip
    operation_time
    content
    }
    }`

export default {
  name: 'Audit',
  mixins: [List],
  components: {
    AuditSchema
  },
  data: () => ({
    columns: [
      {
        title: '日志编号',
        dataIndex: 'audit_id',
        sorter: true,
        width: 100
      },
      {
        title: '模块名称',
        dataIndex: 'module_name',
        width: 120,
        sorter: true
      },
      {
        title: '操作账号',
        dataIndex: 'user_id',
        width: 120,
        sorter: true
      },
      {
        title: '客户端IP',
        dataIndex: 'client_ip',
        width: 120
      },
      {
        title: '功能名称',
        dataIndex: 'actionname',
        width: 120
      },
      {
        title: '操作时间',
        dataIndex: 'operation_time',
        width: 180,
        sorter: true
      },
      {
        title: '操作内容',
        dataIndex: 'content',
        width: 300,
        tooltip: true
      }
    ]
  }),
  methods: {
    loadData (parameter) {
      return apollo.clients.alert.query({
        query,
        variables: {
          orderBy: { operation_time: 'desc' },
          ...parameter,
          where: {
            ...generateQuery(this.queryParams)
          }
        }
      }).then(r => r.data)
    },
    /**
     * 查看详情
     * @event
     */
    onShow () {
      const [record] = this.selectedRows
      this.$refs['schema'].show(record)
    }
  }
}
</script>

<style lang="less">
</style>
