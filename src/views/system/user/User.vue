<template>
  <div class="user">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.loginName" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="邮箱">
                  <a-input v-model="queryParam.email" placeholder=""/>
                </a-form-item>
              </a-col>
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
        <a-button>新建</a-button>
        <a-button :disabled="!hasSelected">编辑</a-button>
        <a-button :disabled="!hasSelected">删除</a-button>
        <a-button :disabled="!hasSelected">重置密码</a-button>
        <a-button :disabled="!hasSelected">分配工作组</a-button>
        <a-button :disabled="!hasSelected">更改状态</a-button>
        <a-button :disabled="!hasSelected">分配权限</a-button>
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
      />
      <!-- E 历史告警列表 -->
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getUserList } from '@/api/system'

export default {
  name: 'User',
  components: {
    STable,
    Ellipsis
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
          title: '用户名',
          dataIndex: 'loginName',
          sorter: true,
          align: 'center',
          width: 100
          // fixed: 'left'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center',
          width: 150,
          sorter: true
        },
        {
          title: '岗位职责',
          dataIndex: 'position',
          align: 'center',
          width: 150
        },
        {
          title: '办公电话',
          dataIndex: 'officePhone',
          align: 'center',
          width: 100
        },
        {
          title: '移动电话',
          dataIndex: 'mobilePhone',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: 'Email',
          dataIndex: 'email'
        }
      ],
      loadData: parameter => {
        // this.selectedRowKeys = []
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(res)
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
    }
  },
  methods: {
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

<style scoped lang='less'>
.opration{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
</style>
