<template>
  <div class="group">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="工作组编号">
                <a-input v-model="queryParam.code" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="工作组名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="有效标识">
                  <a-select
                    allowClear
                    v-model="queryParam.boolUse"
                    placeholder="请选择"
                    default-value="checkall"
                  >
                    <a-select-option value="0">有效</a-select-option>
                    <a-select-option value="1">无效</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary">查询</a-button>
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

      <!-- S 操作栏 -->
      <div class="opration">
        <a-button @click="add">新建</a-button>
        <a-button :disabled="!hasSelectedOne">编辑</a-button>
        <a-button :disabled="!hasSelected">删除</a-button>
        <a-button :disabled="!hasSelectedOne">分配用户</a-button>
        <a-button @click="allocateAdmin" :disabled="!hasSelectedOne">分配管理员</a-button>
        <a-button :disabled="!hasSelectedOne">更改状态</a-button>
        <a-button @click="auth" :disabled="!hasSelectedOne">分配权限</a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <s-table
        ref="table"
        size="small"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ y:400 }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
        <span slot="remark" slot-scope="text">
          <ellipsis :length="60" tooltip>{{ text }}</ellipsis>
        </span>
      </s-table>
      <!-- E 列表 -->
    </a-card>

    <GroupSchema
      ref="schema"
    />

    <AuthScheme
      ref="auth"
    />

    <GroupAdministratorSchema
      ref="groupAdmin"
    />
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getGroupList } from '@/api/system'
import GroupSchema from './GroupSchema'
import AuthScheme from '@/components/Auth/AuthSchema'
import GroupAdministratorSchema from './GroupAdministratorSchema'

export default {
  name: 'Group',
  components: {
    STable,
    Ellipsis,
    GroupSchema,
    AuthScheme,
    GroupAdministratorSchema
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 告警列表表头
      columns: [
        {
          title: '工作组编号',
          dataIndex: 'code',
          sorter: true,
          align: 'center',
          width: 180
          // fixed: 'left'
        },
        {
          title: '工作组名称',
          dataIndex: 'name',
          width: 180,
          align: 'center',
          sorter: true
        },
        {
          title: '有效标志',
          dataIndex: 'boolUse',
          align: 'center',
          width: 180
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      loadData: parameter => {
        // this.selectedRowKeys = []
        return getGroupList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
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
    auth () {
      this.$refs['auth'].edit()
    },
    add () {
      this.$refs['schema'].add()
    },
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
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
</style>
