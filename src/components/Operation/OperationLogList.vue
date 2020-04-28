<template>
  <div class="OperationLogList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="_id"
      :rowSelection="null"
      :scroll="{ x: scrolX, y: `calc(100vh - 290px)`}"
    >

      <template #query>
        <a-form layout="inline" :style="{ overflow: advanced ? 'hidden' : 'auto' }">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="操作人"
                  :md="12"
                  :sm="24"
                  :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.operator"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="操作节点名称"
                  :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%">
                  <a-input v-model.number="queryParams.name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row>
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="操作类型"
                    :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 14, offset: 2 }"
                    style="width: 100%">
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
                    :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 14, offset: 2 }"
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
              </template>
            </a-row>
          </div>

          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '0'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-form>
      </template>

    </CTable>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import { OperationLogService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'

const operationList = [
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
]

const operationResultList = [
  {
    name: 'SUCCESS',
    value: 'SUCCESS'
  },
  {
    name: 'FAILED',
    value: 'FAILED'
  }
]

export default {
  name: 'OperationLogList',
  components: {
    CTable
  },
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    // 搜索： 展开/关闭
    advanced: false,
    // 查询参数
    queryParams: {},
    // 选中行的 key
    selectedRowKeys: [],
    operationList,
    operationResultList
  }),
  computed: {
    // FIXME: 小屏下只展示出了部分列
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
    },
    scrolX: {
      get () {
        return this.columns.map(el => el.width || 60).reduce((x1, x2) => x1 + x2) + 36
      }
    }
  },
  watch: {
    '$props': {
      immediate: false,
      deep: true,
      handler (val) {
        // 重置查询条件
        this.reset()
        // 重新查询
        this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    loadData (parameter) {
      return OperationLogService.find({
        ...parameter,
        where: {
          ...this.where,
          ...generateQuery(this.queryParams)
        },
        fields: [
          '_id',
          'modelName',
          'name',
          'operator',
          'operation',
          'operatingTime',
          'operationResult',
          'relationId',
          'relation'
        ],
        alias: 'data'
      }).then(r => {
        console.log(r.data)
        return r.data
      })
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 重置组件数据
     */
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    /**
     * 表格行选中
     * @event
     * @return {Undefined}
     */
    selectRow (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    /**
     * 切换搜索栏展开 / 收起状态
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style lang="less">
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
