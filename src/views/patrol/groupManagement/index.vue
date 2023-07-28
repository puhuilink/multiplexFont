<template>
  <div class="role">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row>
          <a-col :md="12" :sm="24">
            <a-form-item label="巡更组编号" v-bind="formItemLayout" class="fw">
              <a-input allowClear v-model.trim="queryParams.user_name" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="巡更组名称" v-bind="formItemLayout" class="fw">
              <a-input allowClear v-model.trim="queryParams.user_status" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="有效标识" v-bind="formItemLayout" class="fw">
              <a-select allowClear v-model.trim="queryParams.end_time" placeholder="请选择"/>
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <span class="collapse">
        <a-button @click="query" type="primary">查询</a-button>
        <a-button @click="resetQueryParams" >重置</a-button>
      </span>
    </a-form>

    <!-- / 操作区域 -->
    <div>
      <a-button @click="onAddUser" v-action:M0101>新增巡更组</a-button>
      <a-button @click="onAddUser" v-action:M0101 :disabled="!hasSelected||selectedRowKeys.length!==1">编辑巡更组</a-button>
      <a-button @click="onAddUser" v-action:M0101 :disabled="!hasSelected">删除巡更组</a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="loadData()"
      ref="table"
      rowKey="role_code"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <template #status="text,record">
        <a-switch :checked="text" @change="onStatusChange" />
      </template>
    </a-table>

    <RoleSchema ref="schema" @addSuccess="query" @editSuccess="query(false)" />

    <!--    &lt;!&ndash;    <AuthSchema v-action:M0110 ref="auth" @success="query(false)" />&ndash;&gt;-->

    <UserGroupSchema v-action:M0104 ref="group" @editSuccess="query(false)" />
  </div>
</template>

<script>
import RoleSchema from './modules/RoleSchema'
import AuthSchema from '@/components/Auth/AuthSchema'
import UserGroupSchema from './modules/RoleUsersSchema.vue'
import { RoleService } from '@/api'
import { Confirm, List } from '@/components/Mixins'
import _ from 'lodash'
import { USER_FLAG } from '@/tables/user/enum'

export default {
  name: 'Role',
  mixins: [Confirm, List],
  components: {
    RoleSchema,
    AuthSchema,
    UserGroupSchema
  },
  data: () => ({
    columns: Object.freeze([
      {
        title: '巡更组编号',
        dataIndex: 'code',
        sorter: true,
        width: '220px'
      },
      {
        title: '巡更组名称',
        dataIndex: 'name',
        width: '220px',
        sorter: true
      },
      {
        title: '有效标识',
        dataIndex: 'isOpen',
        customRender: (text) => text ? '有效' : '无效',
        width: '180px',
        sorter: true
      },
      {
        title: '备注',
        dataIndex: 'remark',
        'min-width': 300,
        sorter: true
      }
    ]),
    selectedRows: []
  }),
  computed: {
    isSelectedValid () {
      const { selectedRows, hasSelected } = this
      if (hasSelected) {
        return !!selectedRows.find(({ flag }) => flag === USER_FLAG.enabled)
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
      return [
        {
          code: ' xiamenjiankongzu',
          name: '厦门监控组',
          isOpen: false,
          defaultRole: false,
          remark: '仅供厦门数据中心运维人员使用，可浏览厦门数据中心相关配置项及视图告警。',
          createTime: '2023-11-21  08:50:08'
        }, {
          code: ' beijingjiankongzu',
          name: '北京监控组',
          isOpen: true,
          defaultRole: false,
          remark: '仅供北京数据中心运维人员使用，可浏览北京数据中心相关配置项及视图告警。',
          createTime: '2023-11-21  08:50:08'
        }, {
          code: ' 234567890098788',
          name: '厦门巡更动环组',
          isOpen: true,
          defaultRole: true,
          remark: '厦门巡更动环组',
          createTime: '2023-11-21  08:50:08'
        }, {
          code: ' administrator',
          name: '超级管理员组',
          isOpen: true,
          defaultRole: true,
          remark: '系统默认的超级管理员组。 仅限运维本监控平台的超级管理员使用',
          createTime: '2023-11-21  08:50:08'
        }, {
          code: ' personal',
          name: '个人账号专属工作组',
          isOpen: true,
          defaultRole: false,
          remark: '此工作组提供基础权限，个人用户专有权限在用户个人权限中配置',
          createTime: '2023-11-21  08:50:08'
        }, {
          code: ' 234567890098766',
          name: '厦门巡更IT组',
          isOpen: true,
          defaultRole: false,
          remark: '厦门巡更IT组',
          createTime: '2023-11-21  08:50:08'
        }]
      // return RoleService.find({
      //   where: {
      //     ...this.where,
      //     ...generateQuery(this.queryParams)
      //   },
      //   fields: this.columns.map(({ dataIndex }) => dataIndex),
      //   ...parameter,
      //   alias: 'data'
      // }).then((r) => r.data)
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
    onAllocateUserGroup (record) {
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
      const [{ flag }] = this.selectedRows
      const title = flag === USER_FLAG.enabled ? '无法删除' : '删除'
      const content = flag === USER_FLAG.enabled ? '只能删除无效用户' : '确定要删除选中的记录吗？'
      const onOk = flag === USER_FLAG.enabled ? 1 : 0
      this.$promiseConfirmDelete({
        title,
        content,
        onOk: () => {
          if (onOk === 1) {
          } else {
            RoleService.batchDelete(this.selectedRowKeys)
              .then(() => {
                this.$notifyDeleteSuccess()
                this.query(false)
              })
              .catch(this.$notifyError)
          }
        }
      })
    },

    /**
     * 重置用户密码
     * @event
     */
    onResetPwd () {
      const { userId } = this.$store.getters
      const [selectedUserId] = this.selectedRowKeys
      if (userId === selectedUserId) {
        this.$message.warning('当前账号密码请至个人中心重置！')
        return
      }
      this.$promiseConfirm({
        title: '系统提示',
        content: '是否重置选中用户密码？',
        onOk: () =>
          RoleService.setInitialPwd(_.first(this.selectedRowKeys))
            .then(() => {
              this.$notification.success({
                message: '系统提示',
                description: '密码已重置为初始化密码！'
              })
            })
            .catch(this.$notifyError)
      })
    },
    /**
     * 变更用户状态
     * @event
     */
    async onToggleFlag () {
      const [{ user_id, flag }] = this.selectedRows
      this.$promiseConfirm({
        title: '系统提示',
        content: '确认更改用户状态？',
        onOk: () =>
          RoleService.toggleFlag(user_id, flag === USER_FLAG.enabled ? USER_FLAG.disabled : USER_FLAG.enabled)
            .then(() => {
              this.$notifyToggleFlagSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
      })
    },
    /**
     * 清除用户错误次数
     * @event
     */
    async onClearError () {
      const [{ user_id }] = this.selectedRows
      this.$promiseConfirm({
        title: '系统提示',
        content: '确认解除用户限制？',
        onOk: () =>
          RoleService.clearError(user_id)
            .then(() => {
              this.$notifyClearErrorSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
      })
    }
  }
}
</script>

<style lang='less'>
</style>
