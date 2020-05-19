<template>
  <div class="user">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="user_id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">

            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="用户名"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="姓名"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="邮箱"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.email" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="有效标识"
                  v-bind="formItemLayout"
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
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
            <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onAddUser" v-action:M0101>新增</a-button>
        <a-button @click="onEditUser" :disabled="!hasSelectedOne" v-action:M0103>编辑</a-button>
        <a-button @click="onBatchDeleteUser" :disabled="!isSelectedValid" v-action:M0103>删除</a-button>
        <a-button @click="onResetPwd" :disabled="!hasSelectedOne" v-action:M0105>重置密码</a-button>
        <a-button @click="onAllocateUserGroup" :disabled="!hasSelectedOne" v-action:M0104>分配工作组</a-button>
        <a-button @click="onToggleFlag" :disabled="!hasSelectedOne" v-action:M0110>更改状态</a-button>
        <a-button @click="onAllocateUserAuth" :disabled="!hasSelectedOne" v-action:M0110>分配权限</a-button>
      </template>

    </CTable>

    <UserSchema
      ref="schema"
      @addSuccess="query"
      @editSuccess="query(false)"
    />

    <AuthScheme
      ref="auth"
      @success="query(false)"
    />

    <UserGroupSchema
      ref="group"
      @editSuccess="query(false)"
    />
  </div>
</template>

<script>
import UserSchema from './UserSchema'
import AuthScheme from '@/components/Auth/AuthSchema'
import UserGroupSchema from './UserGroupSchema'
import deleteCheck from '@/components/DeleteCheck'
import { UserService } from '@/api-hasura'
import List from '@/components/Mixins/Table/List'
import { generateQuery } from '@/utils/graphql'

export default {
  name: 'User',
  mixins: [List],
  components: {
    UserSchema,
    AuthScheme,
    UserGroupSchema
  },
  data: () => ({
    columns: [
      {
        title: '用户名',
        dataIndex: 'user_id',
        sorter: true,
        width: 180
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
        tooltip: true
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
        width: 200,
        sorter: true
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
        width: 280,
        tooltip: true
      }
    ]
  }),
  computed: {
    isSelectedValid () {
      const { selectedRows, hasSelected } = this
      if (hasSelected) {
        return selectedRows.filter(({ flag }) => !flag).length === selectedRows.length
      } else {
        return false
      }
    }
  },
  methods: {
    /**
     * 加载表格数据回调
     */
    loadData (parameter) {
      return UserService.find({
        where: {
          ...this.where,
          ...generateQuery(this.queryParams)
        },
        fields: this.columns.map(({ dataIndex }) => dataIndex),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    /**
     * 新增用户
     * @event
     */
    onAddUser () {
      this.$refs['schema'].add()
    },
    /**
     * 为用户分配权限
     * @event
     */
    onAllocateUserAuth () {
      const [record] = this.selectedRows
      this.$refs['auth'].edit(record)
    },
    /**
     * 为用户分配工作组
     * @event
     */
    onAllocateUserGroup () {
      const [record] = this.selectedRows
      this.$refs['group'].edit(record)
    },
    /**
     * 编辑用户
     * @event
     */
    onEditUser () {
      const [record] = this.selectedRows
      this.$refs['schema'].edit(record)
    },
    /**
     * 批量删除用户
     * @event
     */
    async onBatchDeleteUser () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.$refs['table'].loading = true
        await UserService.batchDelete(this.selectedRowKeys)
        this.notifyDeleteSuccess()
        this.query(false)
      } catch (e) {
        this.notifyError(e)
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    /**
     * 重置用户密码
     * @event
     */
    onResetPwd () {
      // const [record] = this.selectedRows
      this.$modal.confirm({
        title: '提示',
        content: '是否重置当前用户密码？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        //  TODO
        onOk () {},
        // TODO
        onCancel () {}
      })
    },
    /**
     * 变更用户状态
     * @event
     */
    async onToggleFlag () {
      if (!await deleteCheck.confirm({ content: '确认更改用户状态？' })) {
        return
      }
      try {
        this.$refs['table'].loading = true
        const [record] = this.selectedRows
        await UserService.toggleFlag(record.user_id, Number(!record.flag))
        this.notifyToggleFlagSuccess()
        this.query()
      } catch (e) {
        this.notifyError(e)
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    }
  }
}
</script>

<style lang='less'>
</style>
