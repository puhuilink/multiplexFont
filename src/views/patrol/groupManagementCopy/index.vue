<template>
  <div class="role">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row :gutter="[8, 8]">
          <a-col :span="8" :style="{ textAlign: 'left' }" class="search_box">
            <label class="search_label">搜索条件</label>
            <a-button type="primary" @click="queryList()">
              查询
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="resetQueryParams">
              重置
            </a-button>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="巡更组编号" v-bind="formItemLayout" class="fw">
              <a-input placeholder="请输入巡更组编号" allowClear v-model.trim="Myid" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="巡更组名称" v-bind="formItemLayout" class="fw">
              <a-input placeholder="请输入巡更组名称" allowClear v-model.trim="Myname" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="有效标识" v-bind="formItemLayout" class="fw">
              <a-select show-search v-model="isOpen" @change="handleChange" key="0">
                <a-select-option :value="1"> 有效</a-select-option>
                <a-select-option :value="0"> 无效</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <!-- <span class="collapse">
        <a-button @click="queryList()" type="primary">查询</a-button>
        <a-button @click="resetQueryParams">重置</a-button>
      </span> -->
    </a-form>

    <!-- / 操作区域 -->
    <div class="onAddUserBox operation_box">
      <a-button type="primary" @click="onAddUser" v-action:F010002001>
        <a-icon type="plus-circle" />
        新增巡更组
      </a-button>
      <a-button
        :type="hasSelected && selectedRowKeys.length === 1 ? 'primary' :''"
        @click="onEditUser"
        v-action:F010002002
        :disabled="!hasSelected || selectedRowKeys.length !== 1"
      >
        <a-icon type="edit" />
        编辑巡更组
      </a-button
      >
      <a-button :type="hasSelected ? 'primary' : ''" @click="DeleteGroup" v-action:F010002003 :disabled="!hasSelected">
        <a-icon type="delete" />
        删除巡更组
      </a-button>
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
      :loading="pageLoading"
      :scroll="scroll"
      :rowClassName="(record, index) => index % 2 === 1 ? 'table_bg' : ''"
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

    <RoleSchema ref="schema" @addSuccess="queryList" @editSuccess="queryList(false)" @get_list="getList" />

    <!--    &lt;!&ndash;    <AuthSchema v-action:M0110 ref="auth" @success="query(false)" />&ndash;&gt;-->

    <!-- <UserGroupSchema v-action:M0104 ref="group" @editSuccess="query(false)"  -->
  </div>
</template>

<script>
import RoleSchema from './modules/RoleSchema'
import AuthSchema from '@/components/Auth/AuthSchema'
import UserGroupSchema from './modules/RoleUsersSchema.vue'
import { PathService, RoleService } from '@/api'
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
      pageLoading: false,
      isOpen: null,
      columns: Object.freeze([
        {
          title: '巡更组编号',
          dataIndex: 'id'
        },
        {
          title: '巡更组名称',
          dataIndex: 'name',
          width: '220px'
        },
        {
          title: '有效标识',
          dataIndex: 'isOpen',
          customRender: (text) => (text ? '有效' : '无效'),
          width: '180px'
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
      // biaoshi: '',
      selectedRowKeys: [],
      selectedRowsDate: '', // 表格选中行数据
      // scroll: {}, // 设置表格的滚动属性
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
    this.columns = this.columns.map(el => ({ ellipsis: true, ...el }))
  },
  methods: {
    handleChange (value) {
      console.log(value)
      if (value === '1') {
        this.isOpen = true
        console.log(this.isOpen)
      }
      if (value === '0') {
        this.isOpen = false
      }
    },
    // 查询
    async queryList (page) {
      try {
        if (this.Myid !== '' || this.Myname !== '' || this.isOpen !== null) {
          this.pagination.current = page || 1
        }
        this.pageLoading = true
        const pageSize = this.pagination.pageSize
        const { data } = await xungeng.get('/group/list', {
          params: { pageNum: this.pagination.current, pageSize: pageSize, id: this.Myid, name: this.Myname, isOpen: this.isOpen }
        })
        console.log(data)
        this.dataList = data.list
        this.pagination.total = Number(data.total)
        this.selectedRowKeys = []
        this.selectedRowsDate = []
      } catch (error) {
        throw error
      } finally {
        this.pageLoading = false
      }
    },

    // 4.工作组列表
    async getList () {
      try {
        this.pageLoading = true
        const pageNum = this.pagination.current
        const pageSize = this.pagination.pageSize
        const { data } = await xungeng.get('/group/list', { params: { pageNum: pageNum, pageSize: pageSize } })
        this.pagination.total = Number(data.total)
        this.dataList = data.list
        this.selectedRowKeys = []
        this.selectedRowsDate = []
        // console.log(this.dataList )
      } catch (error) {
        throw error
      } finally {
        this.pageLoading = false
      }
    },

    // 7.工作组删除(DELETE)
    DeleteGroup () {
      this.$promiseConfirmDelete({
        title: '删除',
        content: '确定要删除吗',
        onOk: async () => {
          let A = false
          for (const id of this.selectedRowKeys) {
            // 调用删除接口
            const res = await xungeng.delete(`/group/${id}`)
            console.log(res)
            if (res.msg === 'OK') {
              A = true
              this.$notification.success({
                message: '提示',
                description: '删除成功'
              })
            } else {
              A = false
            }
          }
          if (A === true) {
            this.selectedRowKeys = []
            this.getList()
          }
        }

      })
    },

    onStatusChange () {
    },
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
      if (this.Myid !== '' || this.Myname !== '' || this.isOpen !== null) {
        this.queryList(page)
      } else {
        this.getList()
      }
    },
    handlePageSizeChange (page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      if (this.Myid !== '' || this.Myname !== '' || this.isOpen !== null) {
        this.queryList()
      } else {
        this.getList()
      }
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

<style lang="less">
.onAddUserBox {
  margin-bottom: 15px;

  button {
    margin-right: 10px;
  }
}
</style>
