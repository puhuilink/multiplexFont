<template>
  <div class="wrapper">
    <!--      操作-->
    <div>
      <a-form-model layout="inline" class="form">
        <div class="fold">
          <a-row :gutter="[8,8]">
            <!--            <a-col-->
            <!--              v-bind="colLayout"-->
            <!--            >-->
            <!--              <a-form-model-item-->
            <!--                label="部门"-->
            <!--                v-bind="formItemLayout">-->
            <!--                <a-input-->
            <!--                  v-model="queryParams.apartmentId"-->
            <!--                  placeholder="请输入部门名称"-->
            <!--                />-->
            <!--              </a-form-model-item>-->
            <!--            </a-col>-->
            <a-col
              v-bind="colLayout"
            >
              <a-form-item
                label="登录名"
                v-bind="formItemLayout">
                <a-input
                  v-model="queryParams.userName"
                  placeholder="请输入登录名"
                />
              </a-form-item>
            </a-col>
            <a-col
              v-bind="colLayout"
            >
              <a-form-item
                label="用户名称"
                v-bind="formItemLayout">
                <a-input
                  v-model="queryParams.staffName"
                  placeholder="请输入用户名称"
                />
              </a-form-item>
            </a-col>
            <a-col
              v-bind="colLayout"
            >
              <a-form-item
                label="手机号码"
                v-bind="formItemLayout">
                <a-input
                  v-model="queryParams.mobilePhone"
                  placeholder="手机号码"></a-input>
              </a-form-item>
            </a-col>
            <a-col
              v-bind="colLayout"
            >
              <a-form-item
                label="状态:"
                :labelCol="{ span: 6, offset: 2}"
                :wrapperCol="{ span: 11, offset: 5 }"
              >
                <a-select
                  style="width: 100px"
                  placeholder="用户状态"
                  v-model="queryParams.isOpen"
                >
                  <a-select-option value="true">开启</a-select-option>
                  <a-select-option value="false">关闭</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              v-bind="colLayout"
            >
              <a-form-item
                label="创建时间:"
                :labelCol="{xs:{ span: 7, offset: 0}, md: { span: 6, offset: 0 },xl: { span: 6, offset: 0 }, xxl: { span: 5, offset: 0 }}"
                :wrapperCol="{xs: { span: 16, offset: 2}, md: { span: 16, offset: 2}, xl: { span: 16, offset: 2 }, xxl: { span: 15, offset: 1 } }">
                <a-range-picker
                  style="width: 160px"
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                  :placeholder="['开始时间', '结束时间']"
                  v-model="queryParams.timeList"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="colLayout" :style="{ textAlign: 'left' }">
              <a-button type="primary" @click="query">
                <a-icon type="search" />查询
              </a-button>
              <a-button :style="{ marginLeft: '8px' }" @click="resetQueryParams">
                <a-icon type="sync" />重置
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </div>
    <a-button type="primary" style="margin-bottom: 5px" @click="onAdd">新建</a-button>
    <div class="wrapper_content">
      <div class="wrapper_content_left">
        <a-tree
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="treeData"
          @expand="onExpand"
          @select="onSelect"
        >
        </a-tree>
      </div>

      <div class="wrapper_content_right">
        <a-table
          :columns="columns"
          :pagination="paginationOpt"
          :loading="pageLoading"
          :data-source="dataSource">
          <a slot="name" slot-scope="text">{{ text }}</a>
          <template #isOpen="text, record">
            <a-switch :checked="text" @change="(status) => switchStatus(record, status)"/>
          </template>
          <template #operation="text, record">
            <a @click="onEdit(record)"><a-icon type="edit"/>修改</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link"><a-icon type="down" />更多</a>
              <a-menu slot="overlay" @click="(key) => moreOption(record, key)">
                <a-menu-item key="1">
                  删除
                </a-menu-item>
                <a-menu-item key="2">
                  修改密码
                </a-menu-item>
                <a-menu-item key="3">
                  分配角色
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </a-table>
      </div>
      <assignModal ref="assign" :role="roleList" @operateSuccess="Success"></assignModal>
      <schema ref="schema" :treeData="selectTreeData" @operateSuccess="Success"></schema>
    </div>
  </div>
</template>

<script>
import { Confirm } from '~~~/Mixins'
import { Modal } from 'ant-design-vue'
import assignModal from '@/views/system/userManage/components/assignModal'
import { axios } from '@/utils/request'
import { buildTree } from '@/utils/util'
import schema from './components/schema'
import _ from 'lodash'
import moment from 'moment'
import JSONBig from 'json-bigint'

const columns = [
  {
    title: '登录名',
    dataIndex: 'userName',
    key: 'userName',
    width: 100
  },
  {
    title: '用户名称',
    dataIndex: 'staffName',
    key: 'staffName',
    ellipsis: true
  },
  {
    title: '部门',
    dataIndex: 'orgName',
    key: 'orgName',
    ellipsis: true
  },
  {
    title: '手机号码',
    dataIndex: 'mobilePhone',
    key: 'mobilePhone',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'isOpen',
    key: 'isOpen',
    ellipsis: true,
    scopedSlots: { customRender: 'isOpen' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    ellipsis: true,
    fixed: 'right',
    width: 150,
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'Index',
  mixins: [ Confirm ],
  components: {
    assignModal,
    schema
  },
  data () {
    return {
      dataSource: [],
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
      },
      queryParams: {
        isOpen: null
      },
      pageLoading: false,
      roleList: [],
      selectTreeData: []
    }
  },
  methods: {
    moment,
    onSelect (selectedKeys) {
      // 响应当前部门下的用户
      console.log('selectedKeys', selectedKeys)
      this.queryParams.orgId = selectedKeys[0]
      this.query()
    },
    async getRoles () {
      const { data: { list } } = await axios.get('/role/list', {
        params: {
          pageNum: 1,
          pageSize: 9999
        }
      })
      this.roleList = list
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    change (value) {
      this.password = value.target.value
      console.log('value', value.target.value, this.password)
    },
    renderInput () {
      return (
        <div style={{ textAlign: 'center' }}>
          新密码为：
        <a-input style={{ width: '60%' }} value={this.password} onChange={this.change}></a-input>
        </div>
      )
    },
    renderIcon () {
      return <div></div>
    },
    moreOption (record, { key }) {
      switch (key) {
        case '1':
          const title = '删除'
          const content = '此操作将永久删除该用户，是否继续？'
          this.$promiseConfirmDelete({
            title,
            content,
            closable: true,
            onOk: async () => {
              // const formData = new FormData()
              // formData.append('corpIds', this.selectedRowKeys.map(el => Number(el)))
              // axios.post('/corp/delete', formData, {
              //   headers: {
              //     'Content-type': 'application/x-www-form-urlencoded'
              //   }
              // })
              //   .then(() => {
              //     this.$notifyDeleteSuccess()
              //     this.query(false)
              //   })
              //   .catch(this.$notifyError)
              await axios.delete(`/user/${record.id}`, {
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                }
              })
                .then(() => {
                  this.$notifyDeleteSuccess()
                })
                .catch(this.$notifyError).finally(() => this.query())
            }
          })
          break
        case '2':
          Modal.confirm({
            icon: this.renderIcon,
            title: '提示',
            content: this.renderInput,
            centered: true,
            closable: true,
            onOk: async () => {
              try {
                await axios.post('/user/changeUserPwd', {
                  id: record.id,
                  newPwd: this.password
                }).then(() => {
                  this.$notification.success({
                    message: '系统提示',
                    description: '修改密码成功，下次登录生效'
                  })
                  this.password = ''
                })
              } catch (e) {
                this.$notifyError(e)
                throw e
              }
            }
          })
          break
        case '3':
          this.$refs.assign.onShow(record)
          break
        default:
          return null
      }
    },
    async getData (params = { isOpen: true, orgName: '' }) {
      const { data: { list } } = await axios.get(`/organize/list?isOpen=${params.isOpen}${params.orgName === '' ? '' : '&orgName=' + params.orgName}`)
      this.treeData = buildTree(list.map(el => {
        if (el.parentId === undefined) {
          el.parentId = null
        }
        return el
      }))
      this.selectTreeData = this.buildTree(list.map(el => {
        if (el.parentId === undefined) {
          el.parentId = null
        }
        return el
      }))
    },
    async query () {
      // TODO 查询
      try {
        this.pageLoading = true
        if (this.queryParams.timeList) {
          this.queryParams.createTimeStart = this.moment(this.queryParams.timeList[0]).format('YYYY-MM-DD HH:mm:ss')
          this.queryParams.createTimeEnd = this.moment(this.queryParams.timeList[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        console.log(this.queryParams)
        const { data: { list, total } } = await axios.get('/user/list', {
          params: {
            pageSize: this.paginationOpt.defaultPageSize,
            pageNum: this.paginationOpt.defaultCurrent,
            ..._.omit(this.queryParams, ['timeList'])
          }
        })
        this.dataSource = list
        this.paginationOpt.total = total
      } catch (e) {
        throw e
      } finally {
        this.pageLoading = false
      }
    },
    resetQueryParams () {
      // TODO 重置查询
      this.queryParams = _.omit(this.queryParams, ['apartmentId', 'userName', 'mobilePhone', 'isOpen', 'timeList', 'createTimeStart', 'createTimeEnd'])
    },
    async switchStatus (record, text) {
      console.log('record', record, text)
      record.isOpen = text
      try {
        this.pageLoading = true
        await axios.get('/user/switch', {
          params: {
            id: record.id,
            isOpen: text
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: `${text ? '启用' : '停用'}成功`
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
    },
    Success () {
      this.$refs.schema.onCancel()
      this.query()
    }
  },
  mounted () {
    this.getData()
    this.query()
  },
  beforeMount () {
    this.getRoles()
  }
}
</script>

<style lang='less' scoped>
.wrapper {
  padding: 8px 0;
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
</style>
