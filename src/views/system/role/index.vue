<template>
  <div class="role">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">
        <a-row :gutter="[8, 8]">
          <a-col class="search_box">
            <label class="search_label">搜索条件</label>
            <a-button type="primary" @click="query(true)">
              <a-icon type="search" />
              查询
            </a-button>
            <a-button :style="{ marginLeft: '15px' }" @click="resetQueryParams">
              <a-icon type="sync" />
              重置
            </a-button>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="角色名" v-bind="formItemLayout" class="fw">
              <a-input placeholder="请输入角色名" allowClear v-model.trim="queryParams.name" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="是否启用" v-bind="formItemLayout" class="fw">
              <a-select allowClear v-model.trim="queryParams.isOpen">
                <a-select-option :value="'true'">
                  启用
                </a-select-option>
                <a-select-option :value="'false'">
                  停用
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="创建时间" v-bind="formItemLayout" class="fw">
              <a-range-picker
                :show-time="{ format: 'HH:mm:ss' }"
                :format="dateFormat"
                v-model="queryParams.timeList"
                @change="onDateChange" />
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
      <a-button type="primary" @click="onAddUser" v-action:F001002001>
        <a-icon type="plus-circle" />
        新增
      </a-button>
    </div>
    <div class="wrapper_content">
      <div class="wrapper_content_left">
        <!-- <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" /> -->
        <div v-if="dataLoaded">
          <a-tree
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            :defaultExpandedKeys="expandedRowKeys"
            @expand="onExpand"
            @select="onSelect"
            :showIcon="true"
            :showLine="true">
          </a-tree></div>
      </div>
      <div class="wrapper_content_right">
        <a-table
          :columns="columns"
          :dataSource="defaultData"
          ref="table"
          rowKey="id"
          :pagination="paginationOpt"
          :rowSelection="rowSelection"
          :scroll="scroll"
          :rowClassName="(record, index) => index % 2 === 1 ? 'table_bg' : ''">
          <template #status="text, record">
            <a-switch :checked="text" @change="onStatusChange(record)" :disabled="record.id==='9527'?true:disabled" />
          </template>
          <template #action="text, record">
            <div v-if="record.id!=='9527'">
              <a @click="onEditUser(record)" v-action:F001002002><a-icon type="form" /> 编辑</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">
                  <a-icon type="down" />
                  更多</a>
                <a-menu slot="overlay" @click="(key) => moreOption(record, key)">
                  <a-menu-item key="1" v-action:F001002003 v-show="record.id!=='9527'">
                    <a-icon type="menu-unfold" />
                    菜单权限
                  </a-menu-item>
                  <a-menu-item key="2" v-action:F001002004 v-show="record.id!=='9527'">
                    <a-icon type="database" />
                    数据权限
                  </a-menu-item>
                  <a-menu-item key="3" v-action:F001002005>
                    <a-icon type="usergroup-delete" />
                    分配用户
                  </a-menu-item>
                  <a-menu-item key="4" v-action:F001002006 v-show="record.id!=='9527'">
                    <a-icon type="delete" />
                    删除
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <div v-else>
              <a v-action:F001002005 @click="onAllocateUserGroup(record, key)">
                分配用户
              </a>
            </div>
          </template>
        </a-table>
      </div>
    </div>

    <RoleSchema ref="schema" @addSuccess="query" @editSuccess="query(false)" :treeData="selectTreeData" />
    <RoleSingleSchema ref="singleSchema" @addSuccess="query" @editSuccess="query(false)" />

    <!--    &lt;!&ndash;    <AuthSchema v-action:M0110 ref="auth" @success="query(false)" />&ndash;&gt;-->

    <UserGroupSchema ref="group" @editSuccess="query(false)" />
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
import { axios } from '@/utils/request'
import { buildTree } from '@/utils/util'
import moment from 'moment'

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
    dataLoaded: false,
    selectedKeys: [], // 用于跟踪选中状态的数组
    treeData: [],
    selectTreeData: [],
    disabled: true,
    columns: Object.freeze([
      {
        title: '角色编号',
        dataIndex: 'code',
        width: '180px',
        align: 'center'
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        width: '150px',
        align: 'center'
      },
      {
        title: '所属部门',
        dataIndex: 'organizeName',
        width: '150px',
        align: 'center'
      },
      {
        title: '是否开启',
        dataIndex: 'isOpen',
        scopedSlots: { customRender: 'status' },
        width: '80px',
        align: 'center'
      },
      {
        title: '角色类型',
        dataIndex: 'defaultRole',
        customRender: (text) => text ? '内置角色' : '自定义',
        width: '120px',
        align: 'center'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 100,
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '200px',
        align: 'center'
      },
      {
        title: '操作',
        width: 150,
        align: 'center',
        fixed: 'right',
        scopedSlots: { customRender: 'action' }
      }
    ]),
    defaultData: [],
    selectedRows: [],
    paginationOpt: {},
    queryParams: {
      name: '',
      isOpen: null,
      createTimeStart: '',
      createTimeEnd: '',
      timeList: [],
      orgId: ''
    },
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    expandedRowKeys: ['1']
    // 左侧树

  }),
  mounted () {
    this.initialPagination()
    this.query()
    this.getData()
    this.columns = this.columns.map(el => ({ ellipsis: true, ...el }))
  },
  created () {
    const rolesData = localStorage.getItem('pro__Roles')
    if (rolesData) {
      // 如果存在，将数据转换为对象或数组，具体情况取决于您存储的数据格式
      const menuCodes = JSON.parse(rolesData).value.menuCodes
      const searchString = 'F001002007'// 角色管理状态开关
      if (menuCodes.indexOf(searchString) !== -1) {
        this.disabled = false
      } else {
        this.disabled = true
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
  methods: {
    // 左侧树
    moment,
    onSelect (selectedKeys) {
      // 节点被选择时 响应当前部门下的用户 到这
      this.queryParams.orgId = selectedKeys[0]
      this.selectedKeys = selectedKeys
      this.query()
    },
    // async getRoles () {
    //   const { data: { list } } = await axios.get('/role/list', {
    //     params: {
    //       pageNum: 1,
    //       pageSize: 9999
    //     }
    //   })
    //   this.roleList = list
    // },
    onExpand (expandedKeys) { // 节点展开时
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    // 选择部门
    async getData () {
      const { data: { dataIds, list } } = await axios.get('/organize/list', {
        params: {
          isOpen: true
        }
      })
      this.banList = dataIds
      // console.log(this.banList);
      this.treeData = buildTree(list.map(el => {
        if (el.parentId === undefined) {
          el.parentId = null
        }
        if (!el.isOpen || this.operationShow(this.banList, el.id)) {
          el.disabled = true
        }
        return el
      }))
      this.selectTreeData = this.buildTree(list.map(el => {
        if (el.parentId === undefined) {
          el.parentId = null
        }
        if (!el.isOpen || this.operationShow(this.banList, el.id)) {
          el.disabled = true
        }
        return el
      }))
      // this.expandedRowKeys = [...this.selectTreeData[0].children.filter(el => _.get(el, 'children', []).length > 0).map(el => el.id), '1']
      this.dataLoaded = true
    },
    operationShow (List = [], id = '') {
      return List.indexOf(id) === -1
    },
    buildTree (data, parentId = null) {
      const tree = []
      for (const item of data) {
        if (item.parentId === parentId) {
          const children = this.buildTree(data, item.id)
          if (children.length > 0) {
            item.children = children.map(el => {
              return {
                ...el,
                label: el.name,
                value: el.id
              }
            })
          }
          tree.push({
            ...item,
            label: item.name,
            value: item.id
          })
        }
      }
      return tree
    },
    // -----------------------------
    onDateChange (date, dateString) {
      this.queryParams.createTimeStart = dateString[0]
      this.queryParams.createTimeEnd = dateString[1]
    },
    initialPagination () {
      this.paginationOpt = {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        current: 1,
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt.current = current
          this.paginationOpt.defaultPageSize = pageSize
          this.query()
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt.current = current
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
        createTimeEnd: '',
        timeList: [],
        orgId: ''
      }
      this.selectedKeys = []
    },
    query (first = false) {
      if (first) {
        this.paginationOpt.current = 1
        this.$nextTick()
      }
      this.loadData(this.queryParams)
    },
    /**
     * 加载表格数据回调
     */
    async loadData (parameter) {
      const { name, isOpen, createTimeStart, createTimeEnd, orgId } = parameter
      const res = await RoleService.find(name, isOpen, createTimeStart, createTimeEnd, orgId, this.paginationOpt.current, this.paginationOpt.defaultPageSize)
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
      console.log(record)
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
              .catch(e => this.$message.error(e))
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
            .catch(e => this.$message.error(e))
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
            .catch(e => this.$message.error(e))
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
            .catch(e => this.$message.error(e))
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
            .catch(e => this.$message.error(e))
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
            .catch(e => this.$message.error(e))
      })
    },
    moreOption (record, { key }) {
      switch (Number(key)) {
        case 1:
          this.onUpdateMenu(record)
          break
        case 2:
          this.onUpdateData(record)
          break
        case 3:
          this.onAllocateUserGroup(record)
          break
        case 4:
          this.deleteRole(record)
          break
      }
    }

  }
}
</script>

<style lang="less">
.wrapper {
  // padding: 8px 0;
  &_content {
    margin-top: 3px;
    display: flex;
    justify-content: space-between;

    &_left {
      width: 20vw;
      background-color: rgba(250, 250, 250);
      border: rgb(232, 232, 232) 1px solid;
      border-radius: 5px;
      padding: 5px;
      overflow: scroll;
      margin-left: 23px;
    }

    &_right {
      width: 70vw;
      margin-left: .3vw;
    }
  }
}
</style>
