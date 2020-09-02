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
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input v-model.trim="queryParams.module_name" />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="操作账号"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
            </a-row>

            <div v-show="advanced">
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="功能名称"
                    v-bind="formItemLayout"
                    class="fw"
                  >
                    <a-input v-model.trim="queryParams.actionname" />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="客户端IP"
                    v-bind="formItemLayout"
                    class="fw"
                  >
                    <a-input v-model.trim="queryParams.client_ip" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="时间范围"
                    v-bind="formItemLayout"
                    class="fw"
                  >
                    <a-range-picker
                      allowClear
                      format="YYYY-MM-DD HH:mm"
                      :placeholder="['开始时间', '结束时间']"
                      :showTime="{ format: 'HH:mm' }"
                      class="fw"
                      v-model="queryParams.operation_time"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

            </div>
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
        <a-button @click="onShow" :disabled="!hasSelectedOne">查看</a-button>
      </template>
    </CTable>

    <AuditSchema
      ref="schema"
    />
  </div>
</template>

<script>
import AuditSchema from './modules/AuditSchema'
import { generateQuery } from '@/utils/graphql'
import List from '@/components/Mixins/Table/List'
import { AuditService } from '@/api-hasura'
import moment from 'moment'

export default {
  name: 'Audit',
  mixins: [List],
  components: {
    AuditSchema
  },
  data: () => ({
    columns: Object.freeze([
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
        sorter: true,
        customRender: time => time ? moment(time).format() : ''
      },
      {
        title: '操作内容',
        dataIndex: 'content',
        width: 300,
        tooltip: true
      }
    ])
  }),
  methods: {
    loadData (parameter) {
      return AuditService.find({
        orderBy: { operation_time: 'desc' },
        ...parameter,
        where: generateQuery(this.queryParams),
        fields: this.columns.map(({ dataIndex }) => dataIndex),
        alias: 'data'
      }).then(r => r.data)
    },
    /**
     * 查看详情
     * @event
     */
    onShow () {
      const [record] = this.selectedRows
      this.$refs['schema'].detail(record)
    }
  }
}
</script>

<style lang="less">
</style>
