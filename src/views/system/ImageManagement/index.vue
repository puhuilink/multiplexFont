<template>
  <div class="wrapper" style="display: flex;">
    <!--      操作-->
    <div class="wrapper_content_left" style="overflow: hidden;margin-bottom: 23px; max-height: 1000px;">
      <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="change" />
      <div style="overflow: auto;width: 100%;">
        <div v-if="dataLoaded">
          <a-tree
            :tree-data="treeData"
            :defaultExpandedKeys="expandedRowKeys"
            @expand="onExpand"
            @select="onSelect"
            :showIcon="true"
            :showLine="true"
          >
          </a-tree>
        </div>
      </div>
    </div>
    <div style="width: 83%;">

      <div class="operation_box">
        <a-button type="primary" @click="onAdd" v-action:F001001001>
          <a-icon type="plus-circle" />
          新建
        </a-button>
      </div>
      <div class="wrapper_content">
        <div class="wrapper_content_right">
          <a-table
            :columns="columns"
            :locale="locale"
            :pagination="paginationOpt"
            :loading="pageLoading"
            rowKey="id"
            :rowClassName="(record, index) => index % 2 === 1 ? 'table_bg' : ''"
            :data-source="dataSource">
            <template #img="text, record">
              <img src="@/views/titlePage/assets/JF_xiamen_1F.png" class="border_out_img" alt="" />
            </template>
            <template #isOpen="text, record">
              <a-popconfirm
                :title="`确认要${record.isOpen ? '停用' : '启用'}用户吗？`"
                ok-text="确认"
                cancel-text="取消"
                @confirm="switchStatus(record)"
              >
                <a-switch :checked="record.isOpen" :disabled="disabled" />
              </a-popconfirm>
            </template>
            <template #operation="text, record">
              <a @click="onEdit(record)" v-action:F001001002>
                <a-icon type="form" />
                修改</a>
              <a-divider type="vertical" />
              <a @click="deleteImage(record)" v-action:F001001002>
                <a-icon type="form" />
                删除</a>
              <a-divider type="vertical" />

            </template>
          </a-table>
        </div>
        <schema ref="schema" :treeData="selectTreeData" @operateSuccess="Success"></schema>

      </div>
    </div>
  </div>
</template>

<script>
import { Confirm } from '~~~/Mixins'

import { buildTree } from '@/utils/util'
import schema from './imageTable'

import _ from 'lodash'
import moment from 'moment'
import { axios } from '@/utils/request'
import otp from 'axios'

const columns = [
  {
    title: '部门',
    dataIndex: 'orgName',
    key: 'orgName',
    align: 'center',
    ellipsis: true
  },
  {
    title: '楼层',
    dataIndex: 'mobilePhone',
    key: 'mobilePhone',
    align: 'center',
    ellipsis: true
  },
  {
    title: '是否开启',
    dataIndex: 'isOpen',
    key: 'isOpen',
    ellipsis: true,
    align: 'center',
    scopedSlots: { customRender: 'isOpen' }
  },
  {
    title: '图片',
    dataIndex: 'img',
    key: 'img',
    ellipsis: true,
    align: 'center',
    scopedSlots: { customRender: 'img' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remarks',
    align: 'center',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    ellipsis: true,
    fixed: 'right',
    align: 'center',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'Index',
  mixins: [Confirm],
  components: {
    schema
  },
  data () {
    return {
      dataLoaded: false,
      expandAll: false, // 默认不展开全部
      disabled: false,
      dataSource: [],
      locale: {
        emptyText: <a-empty> </a-empty>
      },
      columns,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      treeData: [],
      formItemLayout: {
        labelCol: { xs: { span: 14 }, md: { span: 8 }, xl: { span: 6 }, xxl: { span: 6 } },
        wrapperCol: {
          xs: { span: 10, offset: 0 },
          md: { span: 14, offset: 0 },
          xl: { span: 16, offset: 2 },
          xxl: { span: 16, offset: 2 }
        }
      },
      colLayout: {
        span: 6
      },
      password: '',
      paginationOpt: {
        defaultCurrent: 1, // 默认当前页数
        current: 1,
        defaultPageSize: 10, // 默认当前页显示数据的大小
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
      },
      queryParams: {
        isOpen: null
      },
      pageLoading: false,
      banList: [],
      selectTreeData: [],
      expandedRowKeys: ['1']
    }
  },
  methods: {
    moment,
    onSelect (selectedKeys) {
      // 响应当前部门下的用户
      this.queryParams.orgId = selectedKeys[0]
      this.query()
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    change (value) {
      this.password = value.target.value
    },
    deleteImage (record) {
      const title = '删除'
      const content = '此操作将永久删除该数据，是否继续？'
      this.$promiseConfirmDelete({
        title,
        content,
        closable: true,
        onOk: async () => {
          /* await axios.delete(`/user/${record.id}`, {
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            }
          })
            .then(() => {
              this.$notifyDeleteSuccess()
            })
            .catch(this.$notifyError).finally(() => this.query()) */
        }
      })
    },

    async getData () {
      const { data: { dataIds, list } } = await axios.get('/organize/list', {
        params: {
          isOpen: true
        }
      })
      this.banList = dataIds
      // 设置 expandAll 属性为 true 只需在数据加载后执行一次
      this.expandAll = true
      this.treeData = buildTree(list.map(el => {
        if (el.parentId === undefined) {
          el.parentId = null
        }
        if (!el.isOpen || this.operationShow(this.banList, el.id)) {
          el.disabled = true
        }
        return el
      }))
      // 调试tree高度
      // const data = this.treeData[0].children[0]
      // for (let i = 0; i <= 50; i++) {
      //   this.treeData[0].children.push(data)
      // }
      // console.log(this.treeData[0].children[0], 'treeData')

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
      // 数据加载完成后，设置 dataLoaded 为 true，触发重新渲染
      this.dataLoaded = true
    },
    operationShow (List = [], id = '') {
      return List.indexOf(id) === -1
    },
    async query (first = false) {
      // TODO 查询
      try {
        this.pageLoading = true
        if (first) {
          this.paginationOpt.current = 1
          this.$nextTick()
        }
        if (this.queryParams.timeList) {
          this.queryParams.createTimeStart = this.moment(this.queryParams.timeList[0]).format('YYYY-MM-DD HH:mm:ss')
          this.queryParams.createTimeEnd = this.moment(this.queryParams.timeList[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        const { data: { list, total } } = await axios.get('/user/list', {
          params: {
            pageSize: this.paginationOpt.defaultPageSize,
            pageNum: this.paginationOpt.current,
            ..._.omit(this.queryParams, ['timeList'])
          }
        })
        this.dataSource = list
        this.paginationOpt.total = Number(total)
      } catch (e) {
        throw e
      } finally {
        this.pageLoading = false
      }
    },
    resetQueryParams () {
      // TODO 重置查询
      this.queryParams = _.omit(this.queryParams, ['apartmentId', 'staffName', 'mobilePhone', 'isOpen', 'timeList', 'createTimeStart', 'createTimeEnd', 'userName'])
    },
    async switchStatus (record) {
      record.isOpen = !record.isOpen
      try {
        this.pageLoading = true
        await axios.get('/user/switch', {
          params: {
            id: record.id,
            isOpen: record.isOpen
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: `${record.isOpen ? '启用' : '停用'}成功`
        })
      } catch (e) {
        throw e
      } finally {
        this.pageLoading = false
      }
    },
    onAdd () {
      this.$refs.schema.add()
    },
    onEdit (record) {
      this.$refs.schema.edit(record)
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
    }

  },
  mounted () {
    this.getData()
    this.query()
    // 角色管理状态
    const rolesData = localStorage.getItem('pro__Roles')
    if (rolesData) {
      const menuCodes = JSON.parse(rolesData).value.menuCodes
      const searchString = 'F001001002'// 用户管理状态开关同修改
      if (menuCodes.indexOf(searchString) !== -1) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
    this.columns = this.columns.map(el => ({ ellipsis: true, ...el }))
  }
}
</script>

<style lang="less" scoped>
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
      width: 75vw;
      margin-left: .3vw;
    }
  }
}

.modal_input {
  width: 69%;
}

.modal_input::before {
  content: '新密码：';
  font-size: 15px;
}

.form {
  margin-right: 10px;

  .fold {
    flex: 1;
    display: inline-block;
    width: 100%;
  }

  .collapse {
    float: right;
    overflow: hidden;
    transform: translateY(3.5px);
  }
}
.border_out_img{
  width: 100%;
}
</style>
