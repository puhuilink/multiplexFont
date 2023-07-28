<template>
  <div class="role">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row>
          <a-col :md="12" :sm="24">
            <a-form-item label="巡更组编号" v-bind="formItemLayout" class="fw">
              <a-input allowClear v-model.trim="Myid" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="巡更组名称" v-bind="formItemLayout" class="fw">
              <a-input allowClear v-model.trim="Myname" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="有效标识" v-bind="formItemLayout" class="fw">
              <a-select show-search placeholder="请选择" @change="handleChange" key="0">
                <a-select-option value="true"> 有效 </a-select-option>
                <a-select-option value="false"> 无效</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <span class="collapse">
        <a-button @click="queryList()" type="primary">查询</a-button>
        <a-button @click="resetQueryParams">重置</a-button>
      </span>
    </a-form>

    <!-- / 操作区域 -->
    <div class="onAddUserBox">
      <a-button @click="onAddUser" v-action:M0101>新增巡更组</a-button>
      <a-button
        @click="onEditUser"
        v-action:M0101
        :disabled="!hasSelected || selectedRowKeys.length !== 1"
      >编辑巡更组</a-button
      >
      <a-button @click="DeleteGroup" v-action:M0101 :disabled="!hasSelected">删除巡更组</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataList"
      ref="table"
      :rowKey="(record) => record.id"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :scroll="scroll"
    >
      <template #status="text, record">
        <a-switch :checked="text" @change="onStatusChange" />
      </template>
    </a-table>

    <RoleSchema ref="schema" @addSuccess="query" @editSuccess="query(false)" />

    <!--    &lt;!&ndash;    <AuthSchema v-action:M0110 ref="auth" @success="query(false)" />&ndash;&gt;-->

    <!-- <UserGroupSchema v-action:M0104 ref="group" @editSuccess="query(false)"  -->
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
import { xungeng } from '@/utils/request'
import { encrypt, decrypt } from '@/utils/aes'
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
        dataIndex: 'id',
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
        customRender: (text) => (text ? '有效' : '无效'),
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
    selectedRows: [],
    Myid: '',
    Myname: '',
    dataList: [],
    biaoshi: '',
    selectedRowKeys: [],
    selectedRowsDate: '' // 表格选中行数据
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
  mounted () {
    this.getList()
  },
  methods: {
    handleChange (value) {
      console.log(value)
      if (value === 'true') {
        this.biaoshi = true
        console.log(typeof this.biaoshi)
      }
      if (value === 'false') {
        this.biaoshi = false
      }
    },
    // 查询
    async queryList () {
      const pageNum = 1
      const pageSize = 10
      const { data } = await xungeng.get('/group/list', {
        params: { pageNum: pageNum, pageSize: pageSize, id: this.Myid, name: this.Myname, isOpen: this.biaoshi }
      })
      console.log(data)
      this.dataList = data.list
    },

    // 4.工作组列表
    async getList () {
      const pageNum = 1
      const pageSize = 10
      const { data } = await xungeng.get('/group/list', { params: { pageNum: pageNum, pageSize: pageSize } })
      console.log(data)
      this.dataList = data.list
    },

    // 7.工作组删除(DELETE)
    async DeleteGroup () {
      const idArr = this.selectedRowKeys
      console.log(idArr)

      for (const id of idArr) {
        // console.log(id);

        const res = await xungeng.delete('/xunjian/group', { params: { id: id } })
        // 执行你的操作，使用id和res
        console.log(res)
      }
      this.getList()
    },
    onStatusChange () {},
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      console.log(selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRowsDate = selectedRows[0] // 选中的行数据
    },

    /**
     * 新增用户
     * @event
     */
    onAddUser () {
      this.$refs['schema'].add()
    },
    // onAddUseredit () {
    //   this.$refs['schema'].edit()
    // },
    /**
     * 为用户分配权限
     * @event
     */
    // onAllocateUserAuth () {
    //   const [record] = this.selectedRows
    //   this.$refs['auth'].edit(record)
    // },
    /**
     * 为用户分配工作组
     * @event
     */
    // onAllocateUserGroup (record) {
    //   this.$refs['group'].edit(record)
    // },
    /**
     * 编辑用户
     * @event
     */
    onEditUser () {
      const record = this.selectedRowsDate
      // console.log(record);
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
.onAddUserBox {
  margin-bottom: 15px;
  button {
    margin-right: 10px;
  }
}
</style>
