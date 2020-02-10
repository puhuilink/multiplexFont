<template>
  <div class="audit">
    <CTable
      ref="table"
      rowKey="audit_id"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: scrollX, y:720 }"
      :customRow="customRow"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows, onChange: onSelectChange }"
    >

      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="模块名称"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.module_name" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="操作账号"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.user_id" placeholder=""/>
                </a-form-item>
              </a-col>
              <!-- 多余筛选框是否展示 -->
            </a-row>
            <div v-show="advanced">
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="功能名称"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    style="width: 100%"
                  >
                    <a-input v-model="queryParams.actionname" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="客户端IP"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    style="width: 100%"
                  >
                    <a-input v-model="queryParams.client_ip" placeholder=""/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="时间范围"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
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
              </a-row>
            </div>

          </div>
          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-form>
      </template>

      <template #operation>
        <a-button @click="show" :disabled="selectedRowKeys.length !== 1">查看</a-button>
      </template>
      <span slot="operateContent" slot-scope="text">
        <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
      </span>
    </CTable>
    <!-- E 列表 -->
    <AduitSchema
      ref="schema"
    />
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
// import { getAuditList } from '@/api/system'
import AduitSchema from './AuditSchema'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import CTable from '@/components/Table/CTable'

const labelCol = {
  span: 4
}

const wrapperCol = {
  span: 14,
  offset: 2
}

const query = gql`query ($where: t_audit_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [t_audit_order_by!]) {
    pagination: t_audit_aggregate(where: $where) {
    aggregate {
    count
    }
    }
    data: t_audit(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    audit_id
    module_name
    user_id
    actionname
    client_ip
    operation_time
    content
    }
    }`

export default {
  name: 'Audit',
  components: {
    CTable,
    Ellipsis,
    AduitSchema
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParams: {},
      labelCol,
      wrapperCol,
      // 告警列表表头
      columns: [
        {
          title: '日志编号',
          dataIndex: 'audit_id',
          sorter: true,
          width: 100
        },
        {
          title: '模块名称',
          dataIndex: 'module_name',
          width: 120,
          sorter: true
        },
        {
          title: '操作账号',
          dataIndex: 'user_id',
          width: 120,
          sorter: true
        },
        {
          title: '客户端IP',
          dataIndex: 'client_ip',
          width: 120
        },
        {
          title: '功能名称',
          dataIndex: 'actionname',
          width: 120
        },
        {
          title: '操作时间',
          dataIndex: 'operation_time',
          width: 180,
          sorter: true
        },
        {
          title: '操作内容',
          dataIndex: 'content',
          sorter: true,
          scopedSlots: { customRender: 'operateContent' }
        }
      ],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  filters: {},
  computed: {
    scrollX: {
      get () {
        return this.columns
          .filter(e => e.width)
          .reduce((a, b) => a + b)
      }
    }
  },
  methods: {
    loadData (parameter) {
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            // ...this.where,
            ...this.queryParams.module_name ? {
              module_name: {
                _ilike: `%${this.queryParams.module_name.trim()}%`
              }
            } : {},
            ...this.queryParams.user_id ? {
              user_id: {
                _ilike: `%${this.queryParams.user_id.trim()}%`
              }
            } : {},
            ...this.queryParams.actionname ? {
              actionname: {
                _ilike: `%${this.queryParams.actionname.trim()}%`
              }
            } : {},
            ...this.queryParams.client_ip ? {
              client_ip: {
                _ilike: `%${this.queryParams.client_ip.trim()}%`
              }
            } : {},
            ...this.queryParams.operation_time ? {
              operation_time: {
                _gt: this.queryParams.operation_time[0],
                _lt: this.queryParams.operation_time[1]
              }
            } : {}
          }
        }
      }).then(r => r.data)
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    show () {
      const [record] = this.selectedRows
      this.$refs['schema'].show(record)
    },
    /**
     * 选中时间但还未确定，或取消时间
     * @param {Array<Moment>} e
     */
    timeChange (e) {
      // 执行了 clear 操作
      if (!e.length) {
        delete (this.queryParams.operation_time)
      }
    },
    /**
     * 选中时间并确定
     * @param {Array<Moment>} e
     */
    timeOk (e) {
      // console.log(e)
      let [startTime, endTime] = e
      startTime = startTime.format('YYYY-MM-DDTHH:mm:ss')
      endTime = endTime.format('YYYY-MM-DDTHH:mm:ss')
      // console.log(startTime)
      this.queryParams = {
        ...this.queryParams,
        // startTime,
        operation_time: [startTime, endTime]
      }
    },
    timeCancel () {
      delete (this.queryParams.operation_time)
      // TODO: allowclear 触发后
    },
    /**
    * 筛选展开开关
    */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
    * 选中行更改事件
    * @param selectedRowKeys
    * @param selectedRows
    */
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
    * 行属性,表格点击事件
    */
    customRow (record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index)
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  .opration{
    margin-bottom: 10px;
    button{
      margin-right: 5px;
    }
  }

  .fold {
    display: inline-block;
    width: calc(100% - 216px);
  }
</style>
