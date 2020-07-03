<template>
  <div class="plan-management">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="巡更区域"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select allowClear v-model="queryParams.ascription">
                    <a-select-option
                      v-for="[code, name] in ascriptionList"
                      :key="code"
                    >{{ name }}</a-select-option>
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

      <template #operation>
        <a-button @click="add">新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="edit">编辑</a-button>
        <a-button :disabled="!hasSelected" @click="batchDelete">删除</a-button>
      </template>

    </CTable>

    <PlanSchema
      ref="schema"
      @addSuccess="query"
      @editSuccess="query"
    ></PlanSchema>
  </div>
</template>

<script>
import PlanSchema from './modules/PlanSchema/index'
import { deletePlan, getUserGroupList } from '@/api/controller/patrol'
import { Confirm, List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import {
  ascriptionList
} from '../typing'
import moment from 'moment'
import { PatrolService } from '@/api-hasura'
import _ from 'lodash'

export default {
  name: 'Plan',
  mixins: [Confirm, List],
  components: {
    PlanSchema
  },
  data: () => ({
    ascriptionList,
    columns: [
      {
        title: '计划名称',
        dataIndex: 'alias',
        width: 150,
        sorter: true
      },
      // {
      //   title: '巡更组',
      //   dataIndex: 'ascription',
      //   width: 150,
      //   sorter: true,
      //   customRender: ascription => ascriptionMapping.get(ascription)
      // },
      {
        title: '新建时间',
        dataIndex: 'create_time',
        width: 150,
        sorter: true,
        customRender: createTime => moment(createTime).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '循环周期',
        dataIndex: 'schedule',
        width: 150,
        sorter: true
      },
      {
        title: '生效时间',
        dataIndex: 'interval',
        width: 150,
        sorter: true
      },
      // {
      //   title: '失效时间',
      //   dataIndex: 'interval',
      //   width: 150,
      //   sorter: true
      // }
      {
        title: '是否启用',
        dataIndex: 'status',
        width: 150,
        sorter: true,
        // TODO: 禁用的字段？
        customRender: status => status === 'enabled' ? '启用' : '禁用'
      }
    ],
    userGroupList: []
  }),
  methods: {
    loadData (parameter) {
      return PatrolService.planFind({
        where: {
          ...generateQuery(this.queryParams)
        },
        // FIXME: 数据库存在两条相同 id 数据
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    async getGroupList () {
      await getUserGroupList().then(r => {
        this.userGroupList = r.data.data
      })
    },
    add () {
      this.$refs['schema'].add()
    },
    edit () {
      const [id] = this.selectedRowKeys
      this.$refs['schema'].edit(id)
    },
    async batchDelete () {
      this.$promiseConfirmDelete({
        onOk: () => deletePlan({ IDs: this.selectedRowKeys })
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    }
  },
  created () {
    this.getGroupList()
  }
}
</script>

<style scoped lang='less'>
</style>
