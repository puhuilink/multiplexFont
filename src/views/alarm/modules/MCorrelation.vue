/*
 * 告警详情 - 关联告警
 */
<template>
  <a-modal
    title="关联告警查看"
    :bodyStyle="{ maxHeight:'550px', overflow: 'auto'}"
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
      :scroll="{ x: 1800, y: 350 }"
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
      <span slot="state" slot-scope="text">
        <a-icon
          type="flag"
          theme="filled"
          :title="text | acStateTitleFilter"
          :style="text=='0'?{color:'#c4c4c4', fontSize:'18px'}:text=='5'?{color:'#00aaf', fontSize:'18px'}:
            text=='10'?{color:'#f99025', fontSize:'18px'}:text=='20'?{color:'#39cc39', fontSize:'18px'}:
              text=='30'?{color:'#000000', fontSize:'18px'}:{}"
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
          title: '级别',
          dataIndex: 'severity',
          width: 75,
          fixed: 'left',
          sorter: true,
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 75,
          sorter: true,
          scopedSlots: { customRender: 'state' }
        },
        {
          title: 'CI名称',
          dataIndex: 'dev_name',
          width: 200,
          sorter: true
        },
        {
          title: '应用名称',
          dataIndex: 'app_name',
          width: 300,
          sorter: true
        },
        {
          title: '消息内容',
          dataIndex: 'message',
          width: 420,
          scopedSlots: { customRender: 'message' }
        },
        {
          title: '首次告警时间',
          dataIndex: 'first_arising_time',
          width: 150,
          sorter: true
        },
        {
          title: '最近告警时间',
          dataIndex: 'arising_time',
          width: 150,
          sorter: true
        },
        {
          title: '次数',
          dataIndex: 'count',
          width: 70,
          sorter: true
        },
        {
          title: '采集系统',
          dataIndex: 'agent_id',
          sorter: true
        }

      ],
      loadData: parameter => {
        const query = gql`query instanceList($limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_alert_order_by!], $cause_alert_id: numeric!) {
          pagination: t_alert_aggregate(where: {cause_alert_id: {_eq: $cause_alert_id}}) {
            aggregate {
              count
            }
          }
          data: t_alert(offset: $offset, limit: $limit, where: {cause_alert_id: {_eq: $cause_alert_id}}, order_by: $orderBy) {
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
            ...this.queryParams,
            cause_alert_id: this.record.alert_id
          }
        }).then(r => r.data)
      },
      record: ''
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
    open (...record) {
      this.visible = true
      this.record = record[0]
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
