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
              <a-select show-search placeholder="请选择" v-model="isOpen" @change="handleChange" key="0">
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
    <!-- <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="{ pageSize: 10 ,total:this.total,current:this.current,onChange: handlePageChange }"
      ref="table"
      :rowKey="(record) => record.id"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :scroll="scroll"

    >
      <template #status="text, record">
        <a-switch :checked="text" @change="onStatusChange" />
      </template>
    </a-table> -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      ref="table"
      :rowKey="(record) => record.id"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :scroll="scroll"
    ></a-table>

    <!-- <a-pagination
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :show-size-changer="true"
      :show-total="total => `显示 ${pageSize} 条记录,共 ${total} 条记录`"
      :on-page-change="handlePageChange"
      :on-show-size-change="handlePageChange"

    ></a-pagination> -->

    <RoleSchema ref="schema" @addSuccess="query" @editSuccess="query(false)" @get_list="getList"/>

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
export default {
  name: 'Role',
  mixins: [Confirm, List],
  components: {
    RoleSchema,
    AuthSchema,
    UserGroupSchema
  },
  data () {
    return {
      isOpen: null,
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
          'min-width': 300
        // sorter: true
        }
      ]),
      selectedRows: [],
      Myid: '',
      Myname: '',
      dataList: [],
      biaoshi: '',
      selectedRowKeys: [],
      selectedRowsDate: '', // 表格选中行数据
      scroll: {}, // 设置表格的滚动属性
      //
      /*   total: Number, // 数据总数
    current: 1,// 当前页
      pageSize: 10, // 每页显示条数 */
      pagination: {
        total: 50,
        current: 1, // 当前页
        pageSize: 10, // 每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '25', '50', '100'], // 每页中显示的数据
        showTotal: (total, pageSize) => `显示${pageSize[0]}-${pageSize[1]}条记录,共 ${total} 条记录`, // 分页中显示总的数据
        onChange: this.handlePageChange, // 页码改变时的回调函数
        onShowSizeChange: this.handlePageSizeChange
      }
    }
  },

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
      const pageNum = this.pagination.current
      const pageSize = this.pagination.pageSize
      const { data } = await xungeng.get('/group/list', {
        params: { pageNum: pageNum, pageSize: pageSize, id: this.Myid, name: this.Myname, isOpen: this.biaoshi }
      })
      console.log(data)
      this.dataList = data.list
    },

    // 4.工作组列表
    async getList () {
      console.log(this.current)
      const pageNum = this.pagination.current
      const pageSize = this.pagination.pageSize
      const { data } = await xungeng.get('/group/list', { params: { pageNum: pageNum, pageSize: pageSize } })
      console.log(data)
      this.pagination.total = Number(data.total)
      this.dataList = data.list
      // console.log(this.dataList );
    },

    // 7.工作组删除(DELETE)
    async DeleteGroup () {
      let A = false
      for (const id of this.selectedRowKeys) {
        // 调用删除接口
        const res = await xungeng.delete(`/group/${id}`)
        console.log(res)
        if (res.msg === 'OK') {
          A = true
        } else {
          A = false
        }
      }
      if (A === true) {
        this.getList()
      }
    },

    onStatusChange () {},
    // 换页+++++++++++++++++++++++++++
    /*   handlePageChange (page) {
    // 在这里编写更换页面的逻辑
      console.log('切换到第', page, '页')
      this.current = page
    }, */
    handlePageChange (page, pageSize) {
      console.log(page, pageSize)
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.getList()
    },
    handlePageSizeChange () {
      this.getList()
    },

    // ++++++++++++++++++++++++++++++++++
    // 获取选中行      括号数据为   id     全部数据
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      // console.log(selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRowsDate = selectedRows
    },

    /**
     * 新增用户
     * @event
     */
    onAddUser () {
      this.$refs['schema'].add()
    },
    onAddUseredit () {
      this.$refs['schema'].edit()
    },

    // 重置
    resetQueryParams () {
      this.Myname = ''
      this.Myid = ''
      this.isOpen = null
    },
    /**
     * 为用户分配权限
     * @event
     */
    // onAllocateUserAuth () {
    //   const [record] = this.selectedRows
    //   this.$refs['auth'].edit(record)
    // },
    // /**
    //  * 为用户分配工作组
    //  * @event
    //  */
    // onAllocateUserGroup (record) {
    //   this.$refs['group'].edit(record)
    // },
    /**
     * 编辑用户
     * @event
     */
    onEditUser () {
      const record = this.selectedRowsDate
      console.log(record)
      this.$refs['schema'].edit(record)
    }
    /**
     * 批量删除用户
     * @event
     */
    // async onBatchDeleteUser () {
    //   const [{ flag }] = this.selectedRows
    //   const title = flag === USER_FLAG.enabled ? '无法删除' : '删除'
    //   const content = flag === USER_FLAG.enabled ? '只能删除无效用户' : '确定要删除选中的记录吗？'
    //   const onOk = flag === USER_FLAG.enabled ? 1 : 0
    //   this.$promiseConfirmDelete({
    //     title,
    //     content,
    //     onOk: () => {
    //       if (onOk === 1) {
    //       } else {
    //         RoleService.batchDelete(this.selectedRowKeys)
    //           .then(() => {
    //             this.$notifyDeleteSuccess()
    //             this.query(false)
    //           })
    //           .catch(this.$notifyError)
    //       }
    //     }
    //   })
    // },

    /**
     * 重置用户密码
     * @event
     */
    // onResetPwd () {
    //   const { userId } = this.$store.getters
    //   const [selectedUserId] = this.selectedRowKeys
    //   if (userId === selectedUserId) {
    //     this.$message.warning('当前账号密码请至个人中心重置！')
    //     return
    //   }
    //   this.$promiseConfirm({
    //     title: '系统提示',
    //     content: '是否重置选中用户密码？',
    //     onOk: () =>
    //       RoleService.setInitialPwd(_.first(this.selectedRowKeys))
    //         .then(() => {
    //           this.$notification.success({
    //             message: '系统提示',
    //             description: '密码已重置为初始化密码！'
    //           })
    //         })
    //         .catch(this.$notifyError)
    //   })
    // },
    /**
     * 变更用户状态
     * @event
     */
    // async onToggleFlag () {
    //   const [{ user_id, flag }] = this.selectedRows
    //   this.$promiseConfirm({
    //     title: '系统提示',
    //     content: '确认更改用户状态？',
    //     onOk: () =>
    //       RoleService.toggleFlag(user_id, flag === USER_FLAG.enabled ? USER_FLAG.disabled : USER_FLAG.enabled)
    //         .then(() => {
    //           this.$notifyToggleFlagSuccess()
    //           this.query(false)
    //         })
    //         .catch(this.$notifyError)
    //   })
    // },
    /**
     * 清除用户错误次数
     * @event
     */
    // async onClearError () {
    //   const [{ user_id }] = this.selectedRows
    //   this.$promiseConfirm({
    //     title: '系统提示',
    //     content: '确认解除用户限制？',
    //     onOk: () =>
    //       RoleService.clearError(user_id)
    //         .then(() => {
    //           this.$notifyClearErrorSuccess()
    //           this.query(false)
    //         })
    //         .catch(this.$notifyError)
    //   })
    // }
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
