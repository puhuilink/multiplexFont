<template>
  <div class="role">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row :gutter="[8, 8]">
          <a-col class="search_box">
            <label class="search_label">搜索条件</label>
            <a-button type="primary" @click="query">查询</a-button>
            <a-button :style="{ marginLeft: '15px' }" @click="resetQueryParams">重置</a-button>
          </a-col>
          <a-col :md="8" :sm="12">
            <a-form-item label="路径名称" v-bind="formItemLayout" class="fw">
              <a-input allowClear placeholder="请输入巡更路径名称" v-model.trim="queryParams.alias" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="12">
            <a-form-item label="工作组名称" v-bind="formItemLayout" class="fw">
              <a-select placeholder="请选择工作组" v-model="select_groupId" style="width: 100%" allowClear>
                <a-select-option v-for="(item ,index) in groupId_arr" :key="index" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <!-- <span class="collapse">
        <a-button @click="query" type="primary">查询</a-button>
        <a-button @click="resetQueryParams" >重置</a-button>
      </span> -->
    </a-form>

    <!-- / 操作区域 -->
    <div class="operation_box">
      <a-button type="primary" @click="onAddUser" v-action:F010001001001><a-icon type="plus-circle" />新增</a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="defaultData"
      ref="table"
      :locale="locale"
      rowKey="role_code"
      :scroll="{x:1500}"
      :pagination="paginationOpt"
    >
      <template #index="text,record,index">{{ index }}</template>
      <template #status="text,record,index">{{ replaceGroupName(text) }}</template>
      <template #action="text,record">
        <a @click="onEditUser(record)" v-action:F010001001002 style="margin-right: 13px;"><a-icon type="form" />编辑</a>
        <a @click="onUpdateMenu(record)" v-action:F010001001003 style="margin-right: 13px;"><a-icon type="control" style="margin-right: 3px;"/>配置巡更路径</a>
        <a @click="onUpdateThreshold(record)" v-action:F010001001004 style="margin-right: 13px;"><a-icon type="control" style="margin-right: 3px;"/>配置阈值</a>
        <a @click="deleteRole(record)" v-action:F010001001005><a-icon type="delete" />删除</a>
      </template>
    </a-table>

    <PathSchema ref="schema" @addSuccess="query" @editSuccess="query(false)" :groupIdArr="dataList"/>
  </div>
</template>

<script>
import PathSchema from './modules/PathSchema.vue'
import { PathService, RoleService } from '@/api'
import { Confirm, List } from '@/components/Mixins'
import _ from 'lodash'
import { USER_FLAG } from '@/tables/user/enum'
import { xungeng, axios } from '@/utils/request'
export default {
  name: 'Path',
  mixins: [Confirm, List],
  components: {
    PathSchema
  },
  data: () => ({
    columns: Object.freeze([
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        width: '80px',
        ellipsis: true,
        scopedSlots: { customRender: 'index' }
      },
      {
        title: '路径名称',
        dataIndex: 'alias',
        align: 'center',
        ellipsis: true,
        width: '150px'
      },
      {
        title: '巡更组',
        dataIndex: 'groupId',
        align: 'center',
        ellipsis: true,
        scopedSlots: { customRender: 'status' },
        width: '120px'
      },
      {
        title: '提交人',
        dataIndex: 'updator',
        align: 'center',
        ellipsis: true,
        width: '120px',
        customRender: (text, el) => el.updator || el.creator
      },
      {
        title: '路径图标识',
        dataIndex: 'ascription',
        align: 'center',
        ellipsis: true,
        width: '240px'
      },
      {
        title: '提交时间',
        dataIndex: 'updateTime',
        align: 'center',
        ellipsis: true,
        width: '200px'
      },
      {
        title: '操作',
        width: '450px',
        ellipsis: true,
        fixed: 'right',
        scopedSlots: { customRender: 'action' }
      }
    ]),
    dataList: [],
    locale: {
      emptyText: <a-empty></a-empty>
    },
    defaultData: [],
    selectedRows: [],
    queryParams: {
      alias: null
    },
    paginationOpt: {},
    select_groupId: '',
    groupId_arr: []
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
    }
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
      this.select_groupId = value
    },
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
    replaceGroupName (text) {
      const arr = this.dataList.filter(element => element.id === text)
      if (arr && arr.length) {
        return arr[0].name
      }
      return ''
    },
    resetQueryParams () {
      this.queryParams = {
        alias: null
      }
      this.select_groupId = ''
    },
    query () {
      this.getList()
      console.log(this.queryParams)
      this.loadData({ ...this.queryParams })
    },
    /**
     * 加载表格数据回调
     */
    async loadData (parameter) {
      const { alias } = parameter
      const { list, total } = await PathService.find(alias, this.paginationOpt.defaultCurrent, this.paginationOpt.defaultPageSize, this.select_groupId)
      if (list) {
        this.defaultData = list
        this.paginationOpt.total = Number.parseInt(total.toString())
      } else {
        this.defaultData = []
      }
    },
    // 4.工作组列表
    async getList () {
      const pageNum = 1
      const pageSize = 9999
      this.groupId_arr = []
      const { data } = await axios.get('/group/list', { params: { pageNum: pageNum, pageSize: pageSize, isOpen: true } })
      /* const { data } = {
        data: {
          total: 2,
          list: [
            {
              id: '234567890098791',
              name: '公规院巡更组',
              remark: '1111',
              organizeId: 77551011547316224,
              isOpean: true,
              deleteFlag: false,
              creator: 756,
              createTime: '2023-08-06 20:54:15',
              updator: 756,
              updateTime: '2023-08-06 20:54:15'
            },
            {
              id: '234567890098793',
              name: '二公局巡更组',
              organizeId: 108203208312094720,
              isOpean: true,
              deleteFlag: false,
              creator: 756,
              createTime: '2023-08-03 20:01:42',
              updator: 756,
              updateTime: '2023-08-03 20:01:42'
            }
          ],
          business: [
            {
              groupId: '234567890098791',
              patrol: true, // true表示对接了巡更路径
              alarm: true // true 表示对接了告警源
            },
            { groupId: '234567890098793',
              patrol: false, // false表示没有对接巡更路径
              alarm: false // false表示没有对接告警源
            }
          ]
        }
      } */
      this.dataList = data.list
      // 请选择工作组赋选择项
      for (const item of data.business) {
        if (item.patrol === true) {
          for (const i of data.list) {
            if (item.groupId === i.id) {
              this.groupId_arr.push(i)
            }
          }
        }
      }
    },
    /**
     * 跳转到配置路径界面
     * @event
     */
    async onUpdateMenu (record) {
      const res = await PathService.getPathList(record.id)
      const {
        zones
      } = res
      await this.$router.push({
        path: '/patrol/config/pathConfig',
        query: { pathId: record.id, zoneId: zones[0].zoneId, pathName: record.alias }
      })
    },
    /**
     * 跳转到配置阈值界面
     * @event
     */
    async onUpdateThreshold (record) {
      const res = await PathService.getPathList(record.id)
      const {
        zones
      } = res
      await this.$router.push({
        path: '/patrol/config/threshold',
        query: { pathId: record.id, zoneId: zones[0].zoneId }
      })
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
     * 删除路线
     * @event
     */
    async deleteRole (record) {
      this.$promiseConfirmDelete({
        title: '删除',
        content: '确定要删除该路线吗',
        onOk: () => {
          PathService.deletePath(record.id)
            .then(() => {
              this.$notifyDeleteSuccess()
              this.query(false)
            })
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
