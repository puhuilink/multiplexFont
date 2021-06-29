<template>
  <div class="plan-management">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      :rowKey="(el) => el.id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item label="巡更组" v-bind="formItemLayout" class="fw">
                  <a-select allowClear v-model="queryParams.group_id">
                    <a-select-option
                      v-for="{ groupId, group_name } in patrolGroupList"
                      :key="groupId"
                      :value="groupId"
                    >{{ group_name }}</a-select-option>
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
        <a-button @click="onAdd">新增</a-button>
        <a-button :disabled="!hasSelectedOne" @click="onEdit">编辑</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete">删除</a-button>
      </template>
    </CTable>

    <PlanSchema ref="schema" @addSuccess="query" @editSuccess="query" />
  </div>
</template>

<script>
import PlanSchema from './modules/PlanSchema/index'
import { Confirm, List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import { ASCRIPTION_LIST, PLAN_STATUS_MAPPING, PLAN_STATUS_ENABLED, PLAN_STATUS_DISABLED } from '../typing'
import moment from 'moment'
import { PatrolService } from '@/api'
import commonMixin from './commonMixin'
import _ from 'lodash'

const timeColumnSnippet = {
  width: 130,
  sorter: true,
  customRender: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss')
}

export default {
  name: 'Plan',
  mixins: [Confirm, List, commonMixin],
  components: {
    PlanSchema
  },
  computed: {},
  data () {
    return {
      ASCRIPTION_LIST,
      columns: [
        {
          title: '计划名称',
          dataIndex: 'alias',
          width: 120,
          sorter: true
        },
        {
          title: '巡更组',
          dataIndex: 'group { group_name }',
          width: 160,
          customRender: (__, { group }) => _.get(group, 'group_name')
        },
        {
          title: '新建时间',
          dataIndex: 'create_time',
          ...timeColumnSnippet
        },
        {
          title: '循环周期',
          dataIndex: 'schedule',
          width: 120
        },
        {
          title: '生效时间',
          dataIndex: 'effect_time',
          width: 130,
          sorter: true,
          ...timeColumnSnippet
        },
        {
          title: '失效时间',
          dataIndex: 'expire_time',
          width: 130,
          sorter: true,
          ...timeColumnSnippet
        },
        {
          title: '是否启用',
          dataIndex: 'status',
          width: 120,
          sorter: true,
          customRender: (status, record) => (
            <a-button onClick={() => this.showModal(record)}>{PLAN_STATUS_MAPPING.get(status)}</a-button>
          )
        }
      ],
      userGroupList: []
    }
  },
  methods: {
    loadData (parameter) {
      return PatrolService.planFind({
        where: {
          ...generateQuery(this.queryParams)
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then((r) => r.data)
    },
    onAdd () {
      this.$refs['schema'].add()
    },
    async onBatchDelete () {
      this.$promiseConfirmDelete({
        onOk: () =>
          PatrolService.planBatchDelete(this.selectedRowKeys)
            .then(() => {
              this.$notifyDeleteSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
      })
    },
    onEdit () {
      const [id] = this.selectedRowKeys
      const tmpid = id.replace(/[^0-9]/gi, '')
      this.$refs['schema'].edit(tmpid)
    },

    // 启用状态
    showModal (val) {
      const tempVal = PLAN_STATUS_MAPPING.get(val.status)
      this.$promiseConfirm({
        title: '系统提示',
        content: '确认更改为' + tempVal + '状态？',
        onOk: () => {
          if (val.status === PLAN_STATUS_ENABLED) {
            PatrolService.pauseJob(val.id)
              .then((res) => {
                this.$notification.success({
                  message: '系统提示',
                  description: res.msg
                })
                val.status = PLAN_STATUS_DISABLED
              })
              .catch((err) => {
                this.$notifyError(err)
                throw err
              })
          } else if (val.status === PLAN_STATUS_DISABLED) {
            PatrolService.resumeJob(val.id)
              .then((res) => {
                this.$notification.success({
                  message: '系统提示',
                  description: res.msg
                })
                val.status = PLAN_STATUS_ENABLED
              })
              .catch((err) => {
                this.$notifyError(err)
                throw err
              })
          }
        }
      })
    }
  },
  created () {
    this.fetchPatrolGroupList()
  }
}
</script>

<style scoped lang='less'>
</style>
