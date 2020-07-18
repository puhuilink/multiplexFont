/*
 * 告警详情-操作日志
 */
<template>
  <a-modal
    title="告警操作日志查看"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
    :width="800"
    style="top: 40px;"
    :visible="visible"
    @ok="handleSolve"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <!-- S 操作 -->
    <a-row type="flex" justify="space-between" >
      <a-col :span="8">
        <a-button
          @click="clearSelect"
        >
          <a-icon type="delete" />
          清除
        </a-button>
      </a-col>
      <a-col :span="8" :offset="8">
        <a-input-search
          placeholder="在结果中查找"
          style="width: 200px"
          @search="onSearch"
        />
      </a-col>
    </a-row>
    <!-- E 操作 -->

    <!-- S 列表 -->
    <CTable
      ref="table"
      rowKey="alert_id"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :scroll="{ x: 1800, y: 350 }"
    >
    </CTable>
    <!-- E 列表 -->
  </a-modal>
</template>

<script>
import { Ellipsis } from '@/components'
import { Modal } from 'ant-design-vue'
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query instanceList($limit: Int! = 0, $offset: Int! = 10, $orderBy: [t_alert_action_log_order_by!], $alert_id: numeric) {
  pagination: t_alert_action_log_aggregate(where: {alert_id: {_eq: $alert_id}}) {
    aggregate {
      count
    }
  }
  data: t_alert_action_log(offset: $offset, limit: $limit, order_by: $orderBy, where:{alert_id: {_eq: $alert_id}}) {
    result
    param_str
    operator
    comments
    alert_id
    action_type
    action_id
    act_time
  }
}`
export default {
  name: 'OperationLog',
  components: {
    CTable,
    Ellipsis
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      visible: false,
      loading: false,
      record: '',
      // 告警列表表头
      columns: [
        {
          title: '时间',
          dataIndex: 'act_time',
          width: 75,
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action_type',
          width: 75,
          sorter: true
        },
        {
          title: '操作人',
          dataIndex: 'operator',
          width: 200,
          sorter: true
        },
        {
          title: '告警编号',
          dataIndex: 'alert_id',
          width: 200,
          sorter: true
        },
        {
          title: '操作参数',
          dataIndex: 'param_str',
          width: 130,
          sorter: true
        },
        {
          title: '当前显示',
          dataIndex: 'comments',
          sorter: true
        }

      ]
    }
  },
  methods: {
    open (...record) {
      this.visible = true
      this.record = record[0]
      console.log(this.record)
    },
    handleSolve (e) {
      this.loading = true
      setTimeout(() => {
        this.visible = false
        this.loading = false
      }, 2000)
    },
    handleCancel (e) {
      console.log('Clicked cancel button')
      this.visible = false
    },
    loadData (parameter) {
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          alert_id: this.record.alert_id
        }
      }).then(r => {
        console.log(r.data)
        return r.data
      })
    },
    onSearch (e) {
      console.log('查找框中输入', e)
    },
    clearSelect () {
      return new Promise(resolve => {
        Modal.confirm({
          title: '清除',
          content: '确定要清除当前告警的所有日志吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            setTimeout(resolve, 1000, true)
          },
          onCancel () {
            resolve(false)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
