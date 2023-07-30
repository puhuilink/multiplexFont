<template>
  <div class="role">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row>
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名" v-bind="formItemLayout" class="fw">
              <a-input allowClear v-model.trim="queryParams.name" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态" v-bind="formItemLayout" class="fw">
              <a-select allowClear v-model.trim="queryParams.isOpen" >
                <a-select-option :value="true">
                  启用
                </a-select-option>
                <a-select-option :value="false">
                  停用
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="创建时间" v-bind="formItemLayout" class="fw">
              <a-input style="width: 40%;margin-right: 15px" allowClear v-model.trim="queryParams.createTimeStart" placeholder="开始时间" />
              ----
              <a-input style="width: 40%;margin-left: 15px" allowClear v-model.trim="queryParams.createTimeEnd" placeholder="结束时间"/>
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
    <a-button @click="onAddUser" v-action:M0101>新增</a-button>
    <a-table
      :columns="columns"
      :dataSource="defaultData"
      ref="table"
      rowKey="role_code"
      :pagination="paginationOpt"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
      <template #status="text,record">
        <a-switch :checked="text" @change="onStatusChange(record)" />
      </template>
      <template #action="text,record">
        <a @click="onEditUser(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="onUpdateMenu(record)">菜单权限</a>
        <a-divider type="vertical" />
        <a @click="onUpdateData(record)">数据权限</a>
        <a-divider type="vertical" />
        <a @click="onAllocateUserGroup(record)">分配用户</a>
        <a-divider type="vertical" />
        <a @click="deleteRole(record)">删除</a>
      </template>
    </a-table>

    <RoleSchema ref="schema" @addSuccess="query" @editSuccess="query(false)" />
    <RoleSingleSchema ref="singleSchema" @addSuccess="query" @editSuccess="query(false)" />

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
import RoleSingleSchema from '@/views/system/role/modules/RoleSingleSchema.vue'

export default {
  name: 'Role',
  mixins: [Confirm, List],
  components: {
    RoleSchema,
    AuthSchema,
    UserGroupSchema,
    RoleSingleSchema
  },
  data: () => ({
    columns: Object.freeze([
      {
        title: '角色编号',
        dataIndex: 'code',
        sorter: true,
        width: '180px'
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        width: '150px',
        sorter: true
      },
      {
        title: '状态',
        dataIndex: 'isOpen',
        scopedSlots: { customRender: 'status' },
        width: '80px',
        sorter: true
      },
      {
        title: '角色类型',
        dataIndex: 'defaultRole',
        customRender: (text) => text ? '内置角色' : '自定义',
        width: '120px',
        sorter: true
      },
      {
        title: '备注',
        dataIndex: 'remark',
        'min-width': 300
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '200px'
      },
      {
        title: '操作',
        width: '400px',
        scopedSlots: { customRender: 'action' }
      }
    ]),
    defaultData: [],
    selectedRows: [],
    paginationOpt:{},
    queryParams: {
      name: '',
      isOpen: null,
      createTimeStart: '',
      createTimeEnd: ''
    }
  }),
  mounted () {
    this.initialPagination()
    this.query()
  },
  computed: {
    isSelectedValid () {
      const { selectedRows, hasSelected } = this
      if (hasSelected) {
        return !!selectedRows.find(({ flag }) => flag === USER_FLAG.enabled)
      } else {
        return false
      }
    },
  },
  methods: {
    initialPagination () {
      this.paginationOpt = {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt.defaultCurrent = current
          this.paginationOpt.defaultPageSize = pageSize
          this.query()
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt.defaultCurrent = current

          this.paginationOpt.defaultPageSize = size
          this.query()
        }
      }
    },
    resetQueryParams () {
      this.queryParams = {
        name: '',
        isOpen: null,
        createTimeStart: '',
        createTimeEnd: ''
      }
    },
    query () {
      this.loadData(this.queryParams)
    },
    /**
     * 加载表格数据回调
     */
    async loadData (parameter) {
      const { name, isOpen, createTimeStart, createTimeEnd } = parameter
      const res = await RoleService.find(name, isOpen, createTimeStart, createTimeEnd, this.paginationOpt.defaultCurrent - 1, this.paginationOpt.defaultPageSize)
      if (res) {
        this.defaultData = res.list
        this.paginationOpt.total = res.total
      } else {
        this.defaultData = [
          {
            code: ' 080001',
            name: 'IT巡更角色',
            isOpen: false,
            defaultRole: false,
            remark: '机房IT巡更，运维角色，交接班，巡更。机房视频监控，仅IT...',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080002',
            name: '动环巡更角色',
            isOpen: true,
            defaultRole: false,
            remark: '机房动环巡更，运维角色，交接班，巡更。机房视频监控，仅....',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080003',
            name: '超级管理员',
            isOpen: true,
            defaultRole: true,
            remark: '所有权限',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080004',
            name: '监控角色',
            isOpen: true,
            defaultRole: true,
            remark: '机房监控、漏洞监控、安全态势感知；',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080005',
            name: '管理角色',
            isOpen: true,
            defaultRole: false,
            remark: '巡更管理、机房视频监控、机房监控、漏洞监控、安全态势感知；',
            createTime: '2023-11-21  08:50:08'
          }, {
            code: ' 080006',
            name: '运维角色',
            isOpen: true,
            defaultRole: false,
            remark: '巡更管理，机房视频监控',
            createTime: '2023-11-21  08:50:08'
          }]
      }
    },
    /**
     * 编辑菜单权限
     * @event
     */
    onUpdateMenu (record) {
      this.$refs['singleSchema'].updateMenu(record)
    },
    /**
     * 编辑数据权限
     * @event
     */
    onUpdateData (record) {
      this.$refs['singleSchema'].updateData(record)
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
    onEditUser (record) {
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
     * 停用/启用角色
     * @event
     */
    async onStatusChange (record) {
      const title = !record.isOpen ? '启用' : '停用'
      const content = !record.isOpen ? '确定要启用角色吗？' : '确定要停用角色吗？'
      this.$promiseConfirmDelete({
        title,
        content,
        okType: 'primary',
        onOk: () => {
          RoleService.switchStatus(record.id, !record.isOpen)
            .then(() => {
              this.$notifyToggleFlagSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
        }

      })
    },
    /**
     * 删除用户
     * @event
     */
    async deleteRole (record) {
      this.$promiseConfirmDelete({
        title: '删除',
        content: '确定要删除该角色吗',
        onOk: () => {
          RoleService.deleteRole(record.id)
            .then(() => {
              this.$notifyDeleteSuccess()
              this.query(false)
            })
            .catch(this.$notifyError)
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
