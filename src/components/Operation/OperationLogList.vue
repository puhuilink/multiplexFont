<template>
  <div class="OperationLogList">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="_id"
      :rowSelection="null"
      :scroll="scroll"
    >

      <template #query>
        <a-form layout="inline" class="form__only">
          <div :class="{ fold: !advanced }">

            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="操作人"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input v-model.trim="queryParams.operator" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="操作节点名称"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input v-model.trim="queryParams.name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="操作类型"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-select v-model="queryParams.operation">
                    <a-select-option
                      v-for="operation in operationList"
                      :key="operation.value"
                      :value="operation.value"
                    > {{ operation.name }} </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="操作结果类型"
                  v-bind="formItemLayout"
                  style="width: 100%">
                  <a-select v-model="queryParams.operationResult">
                    <a-select-option
                      v-for="operationResult in operationResultList"
                      :key="operationResult.value"
                      :value="operationResult.value"
                    > {{ operationResult.name }} </a-select-option>
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

    </CTable>
  </div>
</template>

<script>
import { OperationLogService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'
import List from '@/components/Mixins/Table/List'

export default {
  name: 'OperationLogList',
  mixins: [List],
  data: () => ({
    operationList: [
      {
        name: 'ADD',
        value: 'ADD'
      },
      {
        name: 'UPDATE',
        value: 'UPDATE'
      },
      {
        name: 'DELETE',
        value: 'DELETE'
      },
      {
        name: 'SETPERMISSION',
        value: 'SETPERMISSION'
      }
    ],
    operationResultList: [
      {
        name: 'SUCCESS',
        value: 'SUCCESS'
      },
      {
        name: 'FAILED',
        value: 'FAILED'
      }
    ]
  }),
  computed: {
    columns: {
      get () {
        return [
          {
            title: '操作人',
            dataIndex: 'operator',
            sorter: true,
            width: 180
          },
          {
            title: '操作时间',
            dataIndex: 'operatingTime',
            sorter: true,
            width: 300
          },
          {
            title: '操作节点名称',
            dataIndex: 'name',
            sorter: true,
            width: 400
          },
          {
            title: '数据关联编号',
            dataIndex: 'relationId',
            sorter: true,
            width: 300
          },
          {
            title: '操作类型',
            dataIndex: 'operation',
            sorter: true,
            width: 180
          },
          {
            title: '操作结果类型',
            dataIndex: 'operationResult',
            sorter: true,
            width: 220
          },
          {
            title: '是否为关系',
            dataIndex: 'relation',
            sorter: true,
            width: 160,
            customRender: val => val ? '是' : '否'
          }
        ]
      }
    }
  },
  watch: {
    '$props': {
      immediate: false,
      deep: true,
      handler () {
        this.reset()
        this.query()
      }
    }
  },
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      return OperationLogService.find({
        ...parameter,
        where: {
          ...this.where,
          ...generateQuery(this.queryParams)
        },
        fields: this.columns.map(({ dataIndex }) => dataIndex).concat(['_id']),
        alias: 'data'
      }).then(r => r.data)
    }
  }
}
</script>

<style lang="less">
</style>
