<template>
  <div class="user">
    <cTable
      ref="table"
      rowKey="user_id"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: 1050, y:850 }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="用户名"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.user_id" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="姓名"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.staff_name" placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <!-- 多余筛选框是否展示 -->
              <template v-if="advanced">
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="邮箱"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset: 2 }"
                    style="width: 100%"
                  >
                    <a-input v-model="queryParams.email" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="有效标识"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset: 2 }"
                    style="width: 100%"
                  >
                    <a-select
                      allowClear
                      v-model="queryParams.flag"
                      placeholder="请选择"
                    >
                      <a-select-option value="1">有效</a-select-option>
                      <a-select-option value="0">无效</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </template>
            </a-row>
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
        <a-button @click="add">新建</a-button>
        <a-button @click="edit" :disabled="!hasSelectedOne">编辑</a-button>
        <a-button @click="batchDelete" :disabled="!hasSelected">删除</a-button>
        <a-button @click="resetPwd" :disabled="!hasSelectedOne">重置密码</a-button>
        <a-button @click="allocateGroup" :disabled="!hasSelectedOne">分配工作组</a-button>
        <a-button @click="toggleFlag" :disabled="!hasSelectedOne">更改状态</a-button>
        <a-button @click="allocateAuth" :disabled="!hasSelected">分配权限</a-button>
      </template>

      <span slot="job_title" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="note" slot-scope="text">
        <ellipsis :length="15" tooltip>{{ text }}</ellipsis>
      </span>
    </cTable>
    <!-- E 列表 -->
    <!--  FIXME: apollo 有缓存，此处不会触发刷新  -->
    <UserSchema
      ref="schema"
      @addSuccess="() => { this.reset(); this.query() }"
      @editSuccess="$refs['table'].refresh(false)"
    />

    <AuthScheme
      ref="auth"
    />

    <UserGroupSchema
      ref="group"
      @editSuccess="query"
    />
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import UserSchema from './UserSchema'
import AuthScheme from '@/components/Auth/AuthSchema'
import UserGroupSchema from './UserGroupSchema'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import CTable from '@/components/Table/CTable'
import Template from '../../design/moduels/template/index'
import deleteCheck from '@/components/DeleteCheck'

const query = gql`query ($where: t_user_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [t_user_order_by!]) {
  pagination: t_user_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: t_user(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    user_id
    staff_name
    job_title
    phone
    mobile_phone
    email
    flag
    note
  }
}
`

const deleteUser = gql`mutation delete_user ($userIds: [String!] = []) {
  #   user 表删除
  delete_t_user (where: {
    user_id: {
      _in: $userIds
    }
  }) {
    affected_rows
  }
  #   关联解除
  delete_t_user_group (where: {
    user_id: {
      _in: $userIds
    }
  }) {
    affected_rows
  }
}`

const updateUserFlag = gql`mutation update_user_flag ($userId: String!, $flag: numeric) {
  update_t_user(
    where: {
      user_id: {
        _eq: $userId
      }
    },
    _set: {
      flag: $flag
    }
  ) {
    affected_rows
  }
}`

export default {
  name: 'User',
  components: {
    Template,
    STable,
    CTable,
    Ellipsis,
    UserSchema,
    AuthScheme,
    UserGroupSchema
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
          title: '用户名',
          dataIndex: 'user_id',
          sorter: true,
          width: 180
          // fixed: 'left'
        },
        {
          title: '姓名',
          dataIndex: 'staff_name',
          width: 150,
          sorter: true
        },
        {
          title: '岗位职责',
          dataIndex: 'job_title',
          width: 150,
          scopedSlots: { customRender: 'job_title' }
        },
        {
          title: '办公电话',
          dataIndex: 'phone',
          width: 100,
          sorter: true
        },
        {
          title: '移动电话',
          dataIndex: 'mobile_phone',
          width: 100,
          sorter: true
        },
        {
          title: 'Email',
          dataIndex: 'email',
          width: 280
        },
        {
          title: '有效标志',
          dataIndex: 'flag',
          width: 80,
          sorter: true,
          customRender: val => val ? '有效' : '无效'
        },
        {
          title: '备注',
          dataIndex: 'note',
          width: 120,
          // fixed: 'right',
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
    add () {
      this.$refs['schema'].add()
    },
    edit () {
      const [record] = this.selectedRows
      this.$refs['schema'].edit(record)
    },
    allocateAuth () {
      this.$refs['auth'].edit()
    },
    allocateGroup () {
      const [record] = this.selectedRows
      this.$refs['group'].edit(record)
    },
    async batchDelete () {
      await deleteCheck.sureDelete()
      try {
        this.$refs['table'].loading = true
        await apollo.clients.alert.mutate({
          mutation: deleteUser,
          variables: {
            userIds: [
              ...this.selectedRowKeys
            ]
          }
        })
        this.query()
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    /**
     * 重置密码
     * @return {Undefined}
     */
    resetPwd () {
      // const [record] = this.selectedRows
      this.$modal.confirm({
        title: '提示',
        content: '是否重置当前用户密码？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          //  TODO
        },
        onCancel () {
          // TODO
        }
      })
    },
    /**
     * 更改状态
     * @return {Undefined}
     */
    async toggleFlag () {
      await deleteCheck.confirm({ content: '是否改变用户状态？' })
      try {
        this.$refs['table'].loading = true
        const [record] = this.selectedRows
        apollo.clients.alert.mutate({
          mutation: updateUserFlag,
          variables: {
            userId: record.user_id,
            flag: Number(!record.flag)
          }
        })
        // TODO: toast
        this.query()
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    loadData (parameter) {
      this.selectedRowKeys = []
      this.selectedRows = []
      return apollo.clients.alert.query({
        query,
        variables: {
          // user 表没有id，并非默认按最新数据排序，此处手动指定
          // TODO: 是否table默认都nulls_last
          orderBy: {
            'createdate': 'desc_nulls_last'
          },
          ...parameter,
          where: {
            ...this.where,
            ...this.queryParams.user_id ? {
              user_id: {
                _ilike: `%${this.queryParams.user_id.trim()}%`
              }
            } : {},
            ...this.queryParams.staff_name ? {
              staff_name: {
                _ilike: `%${this.queryParams.staff_name.trim()}%`
              }
            } : {},
            ...this.queryParams.hasOwnProperty('email') ? {
              email: {
                _ilike: `%${this.queryParams.email.trim()}%`
              }
            } : {},
            ...this.queryParams.hasOwnProperty('flag') && this.queryParams.flag !== undefined ? {
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
