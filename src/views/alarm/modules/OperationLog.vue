/*
 * 告警详情-操作日志
 */
<template>
  <a-modal
    title="告警事件查询"
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
          :disabled="!selectedRowKeys.length > 0"
          @click="clearSelect"
        >清除</a-button>
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

export default {
  name: 'MCorrelation',
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
      // 告警列表表头
      columns: [
        {
          title: '时间',
          dataIndex: 'severity',
          width: 75,
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'state',
          width: 75,
          sorter: true
        },
        {
          title: '操作人',
          dataIndex: 'dev_name',
          width: 200,
          sorter: true
        },
        {
          title: '告警编号',
          dataIndex: 'app_name',
          width: 300,
          sorter: true
        },
        {
          title: '操作参数',
          dataIndex: 'count',
          width: 70,
          sorter: true
        },
        {
          title: '当前显示',
          dataIndex: 'agent_id',
          sorter: true
        }

      ],
      loadData: parameter => {
        const query = gql`query instanceList($limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_alert_order_by!]) {
          pagination: t_alert_aggregate(where: {}) {
            aggregate {
              count
            }
          }
          data: t_alert(offset: $offset, limit: $limit, order_by: $orderBy) {
            state
            dev_name
            app_name
            severity
            message
            first_arising_time
            arising_time
            count
            agent_id
            close_time
            close_by
            order_id
            alert_id
            related
            instance
            instance2
          }
        }`
        return apollo.clients.alert.query({
          query,
          variables: {
            ...parameter,
            ...this.queryParams
          }
        }).then(r => r.data)
      }
    }
  },
  methods: {
    open () {
      this.visible = true
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
    onSearch (e) {
      console.log('查找框中输入', e)
    },
    clearSelect () {
      console.log(this.selectedRowKeys, this.selectedRows)
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
