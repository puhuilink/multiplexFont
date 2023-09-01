<template>
  <div class="plan-management">
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row :gutter="[8, 8]">
          <a-col :span="8" :style="{ textAlign: 'left' }" class="search_box">
            <label class="search_label">搜索条件</label>
            <span :class="advanced ? 'expand' : 'collapse'">
              <QueryBtn @click="query" />
              <ResetBtn @click="resetQueryParams" />
            </span>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="巡更组" v-bind="formItemLayout" class="fw">
              <a-select allowClear v-model="queryParams.groupId" placeholder="请输入">
                <a-select-option
                  v-for="{ label, value } in patrolGroupList"
                  :key="value"
                  :value="value"
                >{{ label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <!-- <span :class="advanced ? 'expand' : 'collapse'">
        <QueryBtn @click="query" />
        <ResetBtn @click="resetQueryParams" />
      </span> -->
    </a-form>
    <div style="width: 100%" class="operation_box">
      <a-button type="primary" @click="onAdd" style="margin-right: 10px" v-action:F010003001>
        <a-icon type="plus-circle"/>
        新增</a-button>
      <a-button :type="hasSelectedOne ? 'primary' : ''" :disabled="!hasSelectedOne" @click="onEdit" style="margin-right: 10px" v-action:F010003002>
        <a-icon type="edit" />
        编辑</a-button>
      <a-button :type="hasSelectedOne ? 'primary' : ''" :disabled="!hasSelectedOne" @click="onBatchDelete" v-action:F010003003>
        <a-icon type="delete" />
        删除</a-button>
    </div>
    <a-table
      :columns="columns"
      :rowKey="(el) => el.id"
      :rowSelection="rowSelection"
      :scroll="scroll"
      :data-source="dataSource"
      :loading="pageLoading"
      :pagination="paginationOpt"
      :rowClassName="(record, index)=> index % 2 === 1 ? 'table_bg' : ''"
    ></a-table>

    <PlanSchema ref="schema" @addSuccess="query" @editSuccess="query" />
  </div>
</template>

<script>
import PlanSchema from './modules/PlanSchema/index'
import { Confirm, List } from '@/components/Mixins'
import { ASCRIPTION_LIST, PLAN_STATUS_MAPPING, PLAN_STATUS_ENABLED, PLAN_STATUS_DISABLED } from '../typing'
import moment from 'moment'
import { PatrolService } from '@/api'
import commonMixin from './commonMixin'
import { xungeng } from '@/utils/request'

const timeColumnSnippet = {
  width: 130,
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
      pageLoading: false,
      dataSource: [],
      ASCRIPTION_LIST,
      columns: [
        {
          title: '计划名称',
          dataIndex: 'alias',
          width: 120
        },
        {
          title: '巡更组',
          dataIndex: 'groupName',
          width: 160
        },
        {
          title: '更新时间',
          dataIndex: 'createTime',
          ...timeColumnSnippet
        },
        {
          title: '循环周期',
          dataIndex: 'schedule',
          width: 120
        },
        {
          title: '生效时间',
          dataIndex: 'effectTime',
          width: 130,
          ...timeColumnSnippet
        },
        {
          title: '失效时间',
          dataIndex: 'expireTime',
          width: 130,
          ...timeColumnSnippet
        },
        {
          title: '是否开启',
          dataIndex: 'status',
          width: 120,
          customRender: (status, record) => (
            // <a-button onClick={() => this.showModal(record)}>{PLAN_STATUS_MAPPING.get(status)}</a-button>
            <a-switch checked={status === 'enabled'} onClick={() => this.showModal(record)} />
          )
        }
      ],
      userGroupList: [],
      paginationOpt: {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt.defaultCurrent = current
          this.paginationOpt.defaultPageSize = pageSize
          this.query()
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt.defaultCurrent = current
          this.paginationOpt.defaultPageSize = size
          this.query()
        }
      },
      queryParams: {
        groupId: null
      }
    }
  },
  methods: {
    async query () {
      try {
        this.pageLoading = true
        const { data: { list, total } } = await xungeng.get('/plan/list', {
          params: {
            pageSize: this.paginationOpt.defaultPageSize,
            pageNum: this.paginationOpt.defaultCurrent,
            ...this.queryParams
          }
        })
        this.dataSource = list
        this.paginationOpt.total = total
        this.selectedRows = []
        this.selectedRowKeys = []
      } catch (e) {
        throw e
      } finally {
        this.pageLoading = false
      }
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
      // const tmpid = id.replace(/[^0-9]/gi, '')
      this.$refs['schema'].edit(this.selectedRows[0])
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
                // this.$notifyError(err)
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
                // this.$notifyError(err)
                throw err
              })
          }
        }
      })
    }
  },
  created () {
    this.fetchPatrolGroupList()
  },
  mounted () {
    this.query()
  }
}
</script>

<style scoped lang='less'>
</style>
