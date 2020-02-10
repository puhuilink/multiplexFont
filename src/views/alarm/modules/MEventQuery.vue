/*
 * 告警详情-告警事件查询
 */
<template>
  <a-modal
    title="告警事件查询"
    :bodyStyle="{ padding:'12px!important',maxHeight:'550px', overflow: 'auto'}"
    style="top: 40px;"
    :width="800"
    :visible="visible"
    @ok="handleSolve"
    :loading="loading"
    destroyOnClose
    @cancel="handleCancel"
  >
    <!-- S 操作 -->
    <a-row type="flex" justify="space-between" >
      <a-col
        :xs="12"
        :sm="8"
        :md="8"
        :lg="8"
        :xl="8"
      >
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
      :scroll="{ x: 1100, y: 350 }"
    >
      <span slot="level" slot-scope="text">
        <a-badge
          :count="text | levelFilter"
          :title="text | levelTitleFilter"
          :numberStyle="text==4?{backgroundColor:'#ff0000'}:text==3?{backgroundColor:'#f7870a'}:
            text==2?{backgroundColor:'#ffdb00'}:text==1?{backgroundColor:'#54b9e4'}:
              text==0?{backgroundColor:'#00c356'}:{}"
        />
      </span>
      <span slot="message" slot-scope="text">
        <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
      </span>
    </CTable>
    <!-- E 列表 -->
  </a-modal>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import screening from '../screening'

export default {
  name: 'MEventQuery',
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
          title: '事件ID',
          dataIndex: 'id',
          width: 120,
          fixed: 'left',
          sorter: true
        },
        {
          title: '级别',
          dataIndex: 'severity',
          width: 75,
          sorter: true,
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '事件信息',
          dataIndex: 'message',
          width: 420,
          scopedSlots: { customRender: 'message' }
        },
        {
          title: '最近告警时间',
          dataIndex: 'arising_time',
          width: 150,
          sorter: true
        },
        {
          title: '业务来源',
          dataIndex: 'count',
          width: 120,
          sorter: true
        },
        {
          title: '原系统参数编号',
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
  filters: {
    levelFilter (type) {
      return screening.levelList[type].level
    },
    levelTitleFilter (type) {
      return screening.levelList[type].text
    },
    acStateTitleFilter (type) {
      switch (`${type}`) {
        case '0':
          return '新产生'
        case '5':
          return '已确认'
        case '10':
          return '已前转'
        case '20':
          return '已解决'
        case '30':
          return '已忽略'
        default:
          return type
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
