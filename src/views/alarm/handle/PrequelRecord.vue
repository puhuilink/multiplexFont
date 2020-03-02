/*
 * 前转记录
 */
<template>
  <div class="prequel-record">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="advanced ? 12 : 8" :sm="24">
              <a-form-item label="故障类型">
                <a-input v-model="queryParam.incident_type" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="advanced ? 12 : 8" :sm="24">
              <a-form-item label="故障名称">
                <a-input v-model="queryParam.incident_title" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item label="前转类型">
                  <a-select
                    allowClear
                    v-model="queryParam.forward_type"
                    placeholder="请选择"
                    default-value=""
                  >
                    <a-select-option
                      v-for="item in forwardType"
                      :key="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="前转目标">
                  <a-input v-model="queryParam.forward_destiationn" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="时间范围"
                  style="width: 100%"
                >
                  <a-range-picker
                    allowClear
                    format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="['开始时间', '结束时间']"
                    :showTime="{ format: 'HH:mm:ss' }"
                    style="width: 100%"
                    @ok="timeOk"
                    @cancel="timeCancel"
                    @change="timeChange"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="发送者">
                  <a-input v-model="queryParam.send_by" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="query">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- E 搜索 -->

      <!-- S 列表 -->
      <CTable
        ref="table"
        rowKey="incident_id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: 1500, y:400 }"
        :customRow="customRow"
      >
        <span slot="incidentTitle" slot-scope="text">
          <ellipsis :length="40" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="message" slot-scope="text">
          <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
        </span>
      </CTable>
      <!-- E 列表 -->

      <!-- S model模块 -->
      <prequel-detail ref="detail"></prequel-detail>
      <!-- E model模块 -->
    </a-card>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import prequelDetail from '../modules/prequelDetail'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query instanceList($where: t_forward_record_bool_exp = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_forward_record_order_by!]) {
    pagination: t_forward_record_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    data: t_forward_record(offset: $offset, limit: $limit, order_by: $orderBy, where: $where) {
      comments
      forward_destination
      forward_path_id
      forward_record_id
      forward_type
      incident_id
      incident_title
      incident_type
      send_by
      send_time
      severity
    }
    }`

export default {
  name: 'PrequelRecord',
  components: {
    CTable,
    Ellipsis,
    prequelDetail
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      forwardType: [
        {
          value: 'EOMS',
          label: '运维系统'
        },
        {
          value: 'Email',
          label: '邮件'
        },
        {
          value: 'SMS',
          label: '短信'
        }
      ],
      // 告警列表表头
      columns: [
        {
          title: '前转编号',
          dataIndex: 'incident_id',
          sorter: true,
          align: 'center',
          width: 150,
          fixed: 'left'
        },
        {
          title: '故障类型',
          dataIndex: 'incident_type',
          width: 100,
          sorter: true,
          customRender: (text) => {
            switch (text) {
              case '':
                return ''
              default:
                return text
            }
          }
        },
        {
          title: '故障级别',
          dataIndex: 'severity',
          align: 'center',
          width: 100,
          sorter: true,
          customRender: (text) => {
            switch (text) {
              case 0:
                return 'INFO'
              case 1:
                return 'WARNING'
              case 2:
                return 'MINOR'
              case 3:
                return 'MAJOR'
              case 4:
                return 'CRITICAL'
              default:
                return text
            }
          }
        },
        {
          title: '故障名称',
          dataIndex: 'incident_title',
          width: 300,
          sorter: true,
          scopedSlots: { customRender: 'incidentTitle' }
        },
        {
          title: '发送者',
          dataIndex: 'send_by',
          width: 120,
          sorter: true
        },
        {
          title: '前转类型',
          dataIndex: 'forward_type',
          width: 120,
          sorter: true,
          customRender: (text) => {
            switch (text) {
              case 'EOMS':
                return '运维系统'
              case 'Email':
                return '邮件'
              case 'SMS':
                return '短信'
              default:
                return text
            }
          }
        },
        {
          title: '前转目标',
          dataIndex: 'forward_destiationn',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: '发送时间',
          dataIndex: 'send_time',
          align: 'center',
          width: 180,
          sorter: true
        },
        {
          title: '描述',
          dataIndex: 'comments',
          align: 'center',
          // width: 400,
          scopedSlots: { customRender: 'message' }
        }
      ]
    }
  },
  filters: {
  },
  computed: {
  },
  methods: {
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * 选中时间但还未确定，或取消时间
     * @param {Array<Moment>} e
     */
    timeChange (e) {
      // 执行了 clear 操作
      if (!e.length) {
        delete (this.queryParam.send_time)
      }
    },
    /**
     * 选中时间并确定
     * @param {Array<Moment>} e
     */
    timeOk (e) {
      let [startTime, endTime] = e
      startTime = startTime.format('YYYY-MM-DDTHH:mm:ss')
      endTime = endTime.format('YYYY-MM-DDTHH:mm:ss')
      // console.log(startTime)
      this.queryParam = {
        ...this.queryParam,
        // startTime,
        send_time: [startTime, endTime]
      }
    },
    timeCancel () {
      delete (this.queryParam.send_time)
      // TODO: allowclear 触发后
    },
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      // 清空选中
      this.selectedRowKeys = []
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            // ...this.where
            ...this.queryParam.incident_type ? {
              incident_type: {
                _ilike: `%${this.queryParam.incident_type.trim()}%`
              }
            } : {},
            ...this.queryParam.incident_title ? {
              incident_title: {
                _ilike: `%${this.queryParam.incident_title.trim()}%`
              }
            } : {},
            ...this.queryParam.forward_type ? {
              forward_typ: {
                _eq: this.queryParam.forward_type
              }
            } : {},
            ...this.queryParam.forward_destiationn ? {
              forward_destiationn: {
                _ilike: `%${this.queryParam.forward_destiationn.tirm()}%`
              }
            } : {},
            ...this.queryParam.send_time ? {
              send_time: {
                _gt: this.queryParams.send_time[0],
                _lt: this.queryParams.send_time[1]
              }
            } : {},
            ...this.queryParam.send_by ? {
              forward_destiationn: {
                _ilike: `%${this.queryParam.send_by.tirm()}%`
              }
            } : {}
          }
        }
      }).then(r => r.data)
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 行属性,表格点击事件
     */
    customRow (record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index)
          },
          dblclick: () => {
            this.$refs.detail.open(record)
          }
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.opration{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
</style>
