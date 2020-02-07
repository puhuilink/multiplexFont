<template>
  <div class="group">
    <CTable
      ref="table"
      :columns="columns"
      :data="loadData"
      rowKey="group_id"
      :scroll="{ x: 1180, y: 850}"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="工作组编号"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.group_id" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="工作组名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.group_name" placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  label="有效标识"
                  style="width: 100%"
                >
                  <a-select
                    allowClear
                    defaultValue="1"
                    v-model="queryParams.flag"
                    placeholder="请选择"
                  >
                    <a-select-option value="1">有效</a-select-option>
                    <a-select-option value="0">无效</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParamss = {}">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-form>
      </template>

      <template #opration>
        <a-button @click="add">新建</a-button>
        <a-button :disabled="!hasSelectedOne">编辑</a-button>
        <a-button :disabled="!hasSelected">删除</a-button>
        <a-button @click="allocateUser" :disabled="!hasSelectedOne">分配用户</a-button>
        <a-button @click="allocateAdmin" :disabled="!hasSelectedOne">分配管理员</a-button>
        <a-button :disabled="!hasSelectedOne">更改状态</a-button>
        <a-button @click="auth" :disabled="!hasSelectedOne">分配权限</a-button>
      </template>

      <span slot="note" slot-scope="text">
        <ellipsis :length="60" tooltip>{{ text }}</ellipsis>
      </span>

    </CTable>

    <GroupSchema
      ref="schema"
    />

    <AuthScheme
      ref="auth"
    />

    <GroupAdministratorSchema
      ref="groupAdmin"
    />

    <GroupUserSchema
      ref="groupUser"
    />
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
// import { getGroupList } from '@/api/system'
import GroupSchema from './GroupSchema'
import AuthScheme from '@/components/Auth/AuthSchema'
import GroupAdministratorSchema from './GroupAdministratorSchema'
import GroupUserSchema from './GroupUserSchema'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import CTable from '@/components/Table/CTable'
import Template from '../../design/moduels/template/index'

const query = gql`query ($where: t_group_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [t_group_order_by!])  {
  pagination: t_group_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: t_group (where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {
    group_id
    group_name
    group_type
    group_id
    flag
    note
  }
}
`

export default {
  name: 'Group',
  components: {
    Template,
    CTable,
    Ellipsis,
    GroupSchema,
    AuthScheme,
    GroupAdministratorSchema,
    GroupUserSchema
  },
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParams: {},
      // 告警列表表头
      columns: [
        {
          title: '工作组编号',
          dataIndex: 'group_id',
          sorter: true,
          width: 280
          // fixed: 'left'
        },
        {
          title: '工作组名称',
          dataIndex: 'group_name',
          width: 280,
          sorter: true
        },
        {
          title: '有效标志',
          dataIndex: 'flag',
          width: 120,
          sorter: true,
          customRender: val => val ? '有效' : '失效'
        },
        {
          title: '备注',
          dataIndex: 'note',
          width: '500',
          // fixed: 'right'
          scopedSlots: { customRender: 'note' }
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
    /**
     * 返回表格选中行
     */
    hasSelected () {
      return this.selectedRowKeys.length > 0
    },
    hasSelectedOne () {
      return this.selectedRowKeys.length === 1
    }
  },
  methods: {
    allocateAdmin () {
      this.$refs['groupAdmin'].edit()
    },
    allocateUser () {
      this.$refs['groupUser'].edit()
    },
    auth () {
      this.$refs['auth'].edit()
    },
    add () {
      this.$refs['schema'].add()
    },
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    loadData (parameter) {
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            ...this.queryParams.group_id ? {
              group_id: {
                _ilike: `%${this.queryParams.group_id.trim()}%`
              }
            } : {},
            ...this.queryParams.group_name ? {
              group_name: {
                _ilike: `%${this.queryParams.group_name.trim()}%`
              }
            } : {},
            ...this.queryParams.hasOwnProperty('flag') ? {
              flag: {
                _eq: `${this.queryParams.flag}`
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
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        delete (this.queryParams.flag)
      }
    },
    /**
     * 日期时间空间选择
     */
    onDataChange (value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
    },
    onDataOk (value) {
      console.log('onOk: ', value)
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

<style scoped lang='less'>
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
