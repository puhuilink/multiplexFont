<template>
  <div class="forwardBind">
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
          <div>
            <a-row>

              <a-col :md="12" :sm="24">
                <a-form-item label="工单号" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.order_number" />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item label="当前处理人" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.account" />
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
        <a-button @click="onAdd">一键封禁</a-button>
        <a-button :disabled="!hasSelected" @click="onBatchDelete">删除</a-button>
      </template>
    </CTable>
    <BanSchema
      ref="schema"
      @addSuccess="query(false)"
    ></BanSchema>
  </div>
</template>

<script>
import moment from 'moment'
import { generateQuery } from '@/utils/graphql'
import { List, Schema } from '~~~/Mixins'
import RuleMixin from '@/views/alarm/config/ruleMixin'
import { PatrolAccessBanService } from '@/api/service/patrolAccessBanService'
import BanSchema from './components/BanListSchema'
const format = 'YYYY-MM-DD HH:mm:ss'

export default {
  name: 'Index',
  mixins: [List, RuleMixin, Schema],
  components: { BanSchema },
  data () {
    return {
      visible: false,
      columns: Object.freeze([
        {
          title: '工单号',
          dataIndex: 'order_number',
          width: 120,
          sorter: true
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          width: 120
        },
        {
          title: '封禁状态',
          dataIndex: 'state',
          width: 120,
          customRender: el => el ? '已解封' : '已封禁'
        },
        {
          title: '封禁原因',
          dataIndex: 'remarks',
          width: 120
        },
        {
          title: '封禁时间',
          dataIndex: 'ban_time',
          width: 120,
          customRender: time => moment(time).format(format)
        },
        {
          title: '解禁时间',
          dataIndex: 'unseal_time',
          width: 120,
          customRender: time => time ? moment(time).format(format) : '--'
        },
        {
          title: '操作人',
          dataIndex: 'account',
          width: 120
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 120,
          customRender: (__, record) => {
            return (
              <a-popconfirm
                title={`确定要${record.state ? '封禁' : '解封'}吗？`}
                okText="确定"
                cancelText="取消"
                onconfirm={async () => {
                  try {
                    await PatrolAccessBanService.update({ state: !record.state }, {
                      id: record.id
                    })
                    this.$notification.success({
                      message: '系统提示',
                      description: `${record.state ? '封禁' : '解封'}成功`
                    })
                    this.query(false)
                  } catch (e) {
                    this.$notifyError(e)
                    throw e
                  }
                }}
              >
                <a>{record.state ? '封禁' : '解封'}</a>
              </a-popconfirm>
            )
          }
        }
      ]),
      queryParams: {
        order_number: '',
        account: ''
      }
    }
  },
  methods: {
    moment,
    async onBatchDelete () {
      this.$promiseConfirmDelete({
        onOk: () => PatrolAccessBanService
          .batchDelete(this.selectedRowKeys)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    },
    loadData (parameter) {
      const { ...restQueryParams } = this.queryParams
      return PatrolAccessBanService.find({
        where: {
          ...generateQuery({
            ...restQueryParams
          })
        },
        fields: [
          'id',
          'ip',
          'remarks',
          'state',
          'ban_time',
          'unseal_time',
          'account',
          'order_number'
        ],
        alias: 'data',
        ...parameter
      }).then(r => r.data)
    },
    onAdd () {
      this.$refs.schema.add()
    }
  }
}
</script>

<style lang="less">
.SenderSchema__modal {
  .SendForm {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-items: center;

    &__Select {
      width: 60%;
    }

    .item1 {
      width: 60%;
    }

    .item2 {
      width: 60%;
    }
  }

  .footer {
    float: left;
  }

  .enabled {
    width: 100px;
  }
}

</style>
